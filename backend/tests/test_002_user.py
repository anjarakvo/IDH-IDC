import sys
import os
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc
from models.user import UserUpdateBase
from db.crud_user import update_user_by_admin, get_user_by_email

sys.path.append("..")

account = Acc(email="admin@akvo.org", token=None)

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
            "is_admin": 0,
            "active": 0,
        }

    @pytest.mark.asyncio
    async def test_get_all_user_by_not_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without credential
        res = await client.get(app.url_path_for("user:get_all"))
        assert res.status_code == 403
        # with credential but not an admin
        res = await client.get(
            app.url_path_for("user:get_all"),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_get_user_by_id_by_not_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without credential
        res = await client.get(
            app.url_path_for("user:get_by_id", user_id=1))
        assert res.status_code == 403
        # with credential but not an admin
        res = await client.get(
            app.url_path_for("user:get_by_id", user_id=1),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_delete_user_by_not_admin_cred(
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
            app.url_path_for("user:delete", user_id=user_id))
        assert res.status_code == 403
        # delete user by not admin
        res = await client.delete(
            app.url_path_for("user:delete", user_id=user_id),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_update_user_to_an_admin_by_crud(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="admin@akvo.org")
        assert user.email == "admin@akvo.org"
        update_payload = UserUpdateBase(
            fullname=user.fullname,
            organisation=user.organisation,
            is_admin=True,
            is_active=True,
        )
        user = update_user_by_admin(
            session=session, id=user.id, payload=update_payload)
        assert user.is_admin == 1
        assert user.is_active == 1

    @pytest.mark.asyncio
    async def test_get_all_user_by_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # with admin credential
        res = await client.get(
            app.url_path_for("user:get_all"),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "current": 1,
            "data": [{
                "id": 3,
                "organisation": 1,
                "email": "user@test.com",
                "fullname": "User to delete",
                "is_admin": 0,
                "active": 0,
                "tags_count": 0,
                "projects_count": 0,
            }, {
                "id": 2,
                "organisation": 1,
                "email": "test_user@akvo.org",
                "fullname": "Test User",
                "is_admin": 0,
                "active": 0,
                "tags_count": 0,
                "projects_count": 0,
            }, {
                "id": 1,
                "organisation": 1,
                "email": "admin@akvo.org",
                "fullname": "John Doe",
                "is_admin": 1,
                "active": 1,
                "tags_count": 0,
                "projects_count": 0,
            }],
            "total": 3,
            "total_page": 1
        }

    @pytest.mark.asyncio
    async def test_get_user_by_id_by_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # with admin credential
        res = await client.get(
            app.url_path_for("user:get_by_id", user_id=1),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 1,
            "email": "admin@akvo.org",
            "fullname": "John Doe",
            "is_admin": 1,
            "active": 1,
            "organisation_detail": {"id": 1, "name": "Akvo"},
            "tags_count": 0,
            "projects_count": 0,
        }

    @pytest.mark.asyncio
    async def test_delete_user_by_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # delete user by admin
        res = await client.delete(
            app.url_path_for("user:delete", user_id=3),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 204
