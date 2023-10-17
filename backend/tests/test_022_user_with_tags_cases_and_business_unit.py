import sys
import pytest
import json
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc
from db.crud_user import get_user_by_email
from models.user import UserRole
from models.enum_type import PermissionType
from models.user_business_unit import UserBusinessUnitRole

sys.path.append("..")

account = Acc(email="super_admin@akvo.org", token=None)


class TestUserWithTagsCasesAndBusinessUnitEndpoint():
    @pytest.mark.asyncio
    async def test_invite_user_with_cases_n_tags_by_admin(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Jane Doe",
            "email": "jane@akvo.org",
            "password": None,
            "role": UserRole.user.value,
            "organisation": 1,
            "tags": json.dumps([1]),
            "cases": json.dumps([{
                "case": 1,
                "permission": PermissionType.edit.value,
            }]),
            "business_units": json.dumps([{
                "business_unit": 1,
                "role": UserBusinessUnitRole.admin.value,
            }]),
        }
        # with credential
        res = await client.post(
            app.url_path_for("user:register"),
            params={"invitation_id": 1},
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 200
        user = get_user_by_email(session=session, email=user_payload["email"])
        user = user.to_user_list
        assert user == {
            'id': 5,
            'organisation': 1,
            'email': 'jane@akvo.org',
            'fullname': 'Jane Doe',
            'role': UserRole.user,
            'active': 0,
            'tags_count': 1,
            'cases_count': 1,
        }

    @pytest.mark.asyncio
    async def test_update_user_with_cases_n_tags(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.super_admin.value,
            "is_active": user.is_active,
            "tags": json.dumps([1]),
            "cases": json.dumps([{
                "case": 1,
                "permission": PermissionType.view.value,
            }]),
            "business_units": json.dumps([{
                "business_unit": 1,
                "role": UserBusinessUnitRole.member.value,
            }]),
        }
        # without cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload)
        assert res.status_code == 403
        # with cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'id': 1,
            'fullname': 'John Doe',
            'email': 'super_admin@akvo.org',
            'role': UserRole.super_admin.value,
            'active': True,
            'business_unit_detail': [{
                'id': 4,
                'name': 'Acme Technologies Sales Division',
                'role': 'member'
            }],
            'organisation_detail': {
                'id': 1,
                'name': 'Akvo'
            },
            'tags_count': 1,
            'cases_count': 1,
        }
