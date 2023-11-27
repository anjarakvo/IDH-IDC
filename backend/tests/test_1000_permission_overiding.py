import sys
import pytest

from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import FastAPI
from httpx import AsyncClient

from tests.test_000_main import Acc
from models.user import User, UserRole
from models.case import Case, LivingIncomeStudyEnum
from models.user_business_unit import UserBusinessUnit
from models.enum_type import PermissionType
from models.user_case_access import UserCaseAccess

from seeder.fake_seeder.fake_user import seed_fake_user
from seeder.fake_seeder.fake_case import seed_fake_case

pytestmark = pytest.mark.asyncio
sys.path.append("..")


account = Acc(email="super_admin@akvo.org", token=None)


def find_external_internal_user(session: Session):
    user_business_unit = session.query(UserBusinessUnit).all()
    exclude_user_ids = [ubu.user for ubu in user_business_unit]
    user = session.query(User).filter(User.role == UserRole.user)
    ex_user = user.filter(~User.id.in_(exclude_user_ids)).first()
    in_user = user.filter(User.id.in_(exclude_user_ids)).first()
    return ex_user, in_user


def find_editor_viewer_user(session: Session):
    user_case_access = session.query(UserCaseAccess)
    viewer = user_case_access.filter(
        UserCaseAccess.permission == PermissionType.view
    ).first()
    editor = user_case_access.filter(
        UserCaseAccess.permission == PermissionType.edit
    ).first()
    user = session.query(User)
    viewer_user = user.filter(User.id == viewer.user).first()
    editor_user = user.filter(User.id == editor.user).first()
    return viewer, viewer_user, editor, editor_user


class TestPermissionOveriding:
    @pytest.mark.asyncio
    async def test_seeder_fake_user(self, session: Session) -> None:
        seed_fake_user(session=session)
        users = session.query(User).all()
        for user in users:
            user_detail = user.to_user_detail
            # BU admin
            if user.role == UserRole.admin and user.all_cases:
                assert len(user_detail["business_units"]) > 0
            # Regular/Internal user (user with BU)
            if user.role == UserRole.user and user.all_cases:
                assert len(user_detail["business_units"]) > 0
            # External user (user without BU)
            if user.role == UserRole.admin and not user.all_cases:
                assert len(user_detail["business_units"]) == 0

    @pytest.mark.asyncio
    async def test_search_user_dropdown(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        res = await client.get(
            app.url_path_for("user:search_user_dropdown"),
            params={"search": "Wayan"},
            headers={"Authorization": f"Bearer {account.token}"},
        )
        res = res.json()
        assert res == []

        res = await client.get(
            app.url_path_for("user:search_user_dropdown"),
            params={"search": "super_admin"},
            headers={"Authorization": f"Bearer {account.token}"},
        )
        res = res.json()
        assert res == [{"label": "John Doe <super_admin@akvo.org>", "value": 1}]

    @pytest.mark.asyncio
    async def test_seeder_fake_case(self, session: Session) -> None:
        cases = session.query(Case).count()
        assert cases == 3

        seed_fake_case(session=session)
        cases = session.query(Case).count()
        assert cases == 9

    @pytest.mark.asyncio
    async def test_create_case_by_external_user(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # find external/internal user
        ex_user, in_user = find_external_internal_user(session=session)
        external_user_acc = Acc(email=ex_user.email, token=None)

        payload = {
            "name": "Case by External user",
            "description": "This is a description",
            "date": "2023-10-03",
            "year": 2023,
            "country": 2,
            "focus_commodity": 2,
            "currency": "USD",
            "area_size_unit": "hectare",
            "volume_measurement_unit": "liters",
            "cost_of_production_unit": "Per-area",
            "reporting_period": "Per-season",
            "segmentation": False,
            "living_income_study": LivingIncomeStudyEnum.better_income.value,
            "multiple_commodities": False,
            "other_commodities": [],
            "private": False,
            "tags": [1],
        }

        # external user
        res = await client.post(
            app.url_path_for("case:create"),
            headers={"Authorization": f"Bearer {external_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 403
        res = res.json()
        assert res["detail"] == "You don't have access to create a case"

        # internal user
        internal_user_acc = Acc(email=in_user.email, token=None)
        res = await client.post(
            app.url_path_for("case:create"),
            headers={"Authorization": f"Bearer {internal_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res["created_by"] == in_user.id

    @pytest.mark.asyncio
    async def test_assign_case_access(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # find external/internal user
        ex_user, in_user = find_external_internal_user(session=session)
        payloads = []
        permissions = [PermissionType.edit.value, PermissionType.view.value]
        for index, user in enumerate([ex_user, in_user]):
            payloads.append({"user": user.id, "permission": permissions[index]})

        # not case owner
        case = session.query(Case).all()
        exclude_user = [c.created_by for c in case]
        not_case_owner = (
            session.query(User)
            .filter(and_(User.role == UserRole.user, ~User.id.in_(exclude_user)))
            .first()
        )
        not_case_owner_acc = Acc(email=not_case_owner.email, token=None)

        # assign access by not case owner
        res = await client.post(
            app.url_path_for("case:add_user_case_access", case_id=9),
            headers={"Authorization": f"Bearer {not_case_owner_acc.token}"},
            json=payloads,
        )
        assert res.status_code == 403

        # find case owner
        case = session.query(Case).order_by(Case.id.desc()).first()
        case_owner = case.created_by_user
        case_owner_acc = Acc(email=case_owner.email, token=None)

        # assign access by case owner
        res = await client.post(
            app.url_path_for("case:add_user_case_access", case_id=case.id),
            headers={"Authorization": f"Bearer {case_owner_acc.token}"},
            json=payloads,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [
            {"id": 3, "user": 2, "case": 10, "permission": "edit"},
            {"id": 4, "user": 7, "case": 10, "permission": "view"},
        ]

    @pytest.mark.asyncio
    async def test_edit_case_permission(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        viewer, viewer_user, editor, editor_user = find_editor_viewer_user(
            session=session
        )

        payload = {
            "name": "Case by External user Updated",
            "description": "This is a description",
            "date": "2023-10-03",
            "year": 2023,
            "country": 2,
            "focus_commodity": 2,
            "currency": "USD",
            "area_size_unit": "hectare",
            "volume_measurement_unit": "liters",
            "cost_of_production_unit": "Per-area",
            "reporting_period": "Per-season",
            "segmentation": False,
            "living_income_study": LivingIncomeStudyEnum.better_income.value,
            "multiple_commodities": False,
            "other_commodities": [],
            "private": False,
            "tags": [1],
        }

        # viewer user
        viewer_user_acc = Acc(email=viewer_user.email, token=None)
        res = await client.put(
            app.url_path_for("case:update", case_id=viewer.case),
            headers={"Authorization": f"Bearer {viewer_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 403

        # editor user
        editor_user_acc = Acc(email=editor_user.email, token=None)
        res = await client.put(
            app.url_path_for("case:update", case_id=editor.case),
            headers={"Authorization": f"Bearer {editor_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res["name"] == "Case by External user Updated"
