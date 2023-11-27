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

from seeder.fake_seeder.fake_user import seed_fake_user
from seeder.fake_seeder.fake_case import seed_fake_case

pytestmark = pytest.mark.asyncio
sys.path.append("..")


account = Acc(email="super_admin@akvo.org", token=None)


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
        # find external user
        user_business_unit = session.query(UserBusinessUnit).all()
        exclude_user_ids = [ubu.user for ubu in user_business_unit]
        ex_user = (
            session.query(User)
            .filter(and_(~User.id.in_(exclude_user_ids)), User.role == UserRole.user)
            .first()
        )
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

        res = await client.post(
            app.url_path_for("case:create"),
            headers={"Authorization": f"Bearer {external_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 403
        res = res.json()
        assert res["detail"] == "You don't have access to create a case"

        # find internal user
        in_user = (
            session.query(User)
            .filter(and_(User.id.in_(exclude_user_ids)), User.role == UserRole.user)
            .first()
        )
        internal_user_acc = Acc(email=in_user.email, token=None)
        res = await client.post(
            app.url_path_for("case:create"),
            headers={"Authorization": f"Bearer {internal_user_acc.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res["created_by"] == in_user.id
