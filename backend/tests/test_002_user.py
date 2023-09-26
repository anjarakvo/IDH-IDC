import sys
import os
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

account = Acc(email=None, token=None)

CLIENT_ID = os.environ.get("CLIENT_ID", None)
CLIENT_SECRET = os.environ.get("CLIENT_SECRET", None)


class TestUserEndpoint():
    @pytest.mark.asyncio
    async def test_add_user_without_password(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Test User",
            "email": "test_user@akvo.org",
            "password": None,
            "organisation": 1,
        }
        # without credential
        res = await client.post(
            app.url_path_for("user:register"),
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
            })
        assert res.status_code == 403
        # with credential
        res = await client.post(
            app.url_path_for("user:register"),
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 2,
            "email": "test_user@akvo.org",
            "fullname": "Test User",
            "organisation": 1,
            "active": False
        }

    @pytest.mark.asyncio
    async def test_get_all_user(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without credential
        res = await client.get(app.url_path_for("user:get_all"))
        assert res.status_code == 403
        # with credential
        res = await client.get(
            app.url_path_for("user:get_all"),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 2,
                'organisation': 1,
                'email': 'test_user@akvo.org',
                'fullname': 'Test User',
                'active': False
            }, {
                'id': 1,
                'organisation': 1,
                'email': 'test@akvo.org',
                'fullname': 'John Doe',
                'active': True
            }],
            'total': 2,
            'total_page': 1
        }

    @pytest.mark.asyncio
    async def test_delete_user(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # add user to delete
        user_payload = {
            "fullname": "User to delete",
            "email": "user@test.com",
            "password": None,
            "organisation": 1,
        }
        res = await client.post(
            app.url_path_for("user:register"),
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 200
        res = res.json()
        user_id = res['id']
        # delete user without cred
        res = await client.delete(
            app.url_path_for("user:delete", id=user_id))
        assert res.status_code == 403
        # delete user
        res = await client.delete(
            app.url_path_for("user:delete", id=user_id),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 204
