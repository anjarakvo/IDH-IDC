import sys
import os
import pytest
import json
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc
from db.crud_user import get_user_by_email
from models.user import UserRole
from models.user_business_unit import UserBusinessUnitRole, UserBusinessUnit

sys.path.append("..")

account = Acc(email="super_admin@akvo.org", token=None)

CLIENT_ID = os.environ.get("CLIENT_ID", None)
CLIENT_SECRET = os.environ.get("CLIENT_SECRET", None)


class TestUserEndpoint():
    @pytest.mark.asyncio
    async def test_invite_user_with_no_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Test User",
            "email": "test_user@akvo.org",
            "password": None,
            "role": UserRole.viewer.value,
            "organisation": 1,
            "business_units": json.dumps([{
                "business_unit": 1,
                "role": UserBusinessUnitRole.member.value
            }])
        }
        # without credential
        res = await client.post(
            app.url_path_for("user:register"),
            params={"invitation_id": 1},
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
            })
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_invite_editor_without_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Editor User",
            "email": "editor@akvo.org",
            "password": None,
            "role": UserRole.editor.value,
            "organisation": 1,
        }
        # without credential
        res = await client.post(
            app.url_path_for("user:register"),
            params={"invitation_id": 1},
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 422
        res = res.json()
        assert res == {"detail": "business_units required for editor role"}

    @pytest.mark.asyncio
    async def test_add_viewer_without_password_n_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Test User",
            "email": "test_user@akvo.org",
            "password": None,
            "role": UserRole.viewer.value,
            "organisation": 1,
        }
        # with credential
        res = await client.post(
            app.url_path_for("user:register"),
            data=user_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 422
        res = res.json()
        assert res == {"detail": "business_units required for viewer role"}

    @pytest.mark.asyncio
    async def test_add_viewer_without_password(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Test User",
            "email": "test_user@akvo.org",
            "password": None,
            "role": UserRole.viewer.value,
            "organisation": 1,
            "business_units": json.dumps([{
                "business_unit": 1,
                "role": UserBusinessUnitRole.member.value
            }])
        }
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
            "role": UserRole.viewer.value,
            "active": False,
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
    async def test_update_user_wihtout_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.super_admin.value,
            "is_active": True,
        }
        # without cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload)
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_update_user_to_an_admin_without_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.admin.value,
            "is_active": True,
        }
        # with cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 422
        res = res.json()
        assert res == {"detail": "business_units required for admin role"}

    @pytest.mark.asyncio
    async def test_update_user_to_an_editor_without_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.editor.value,
            "is_active": True,
        }
        # with cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 422
        res = res.json()
        assert res == {"detail": "business_units required for editor role"}

    @pytest.mark.asyncio
    async def test_update_user_to_a_viewer_without_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.viewer.value,
            "is_active": True,
        }
        # with cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 422
        res = res.json()
        assert res == {"detail": "business_units required for viewer role"}

    @pytest.mark.asyncio
    async def test_update_user_to_an_external_user_without_business_units(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.user.value,
            "is_active": True,
        }
        # with cred
        res = await client.put(
            app.url_path_for("user:update", user_id=user.id),
            data=update_payload,
            headers={
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {account.token}"
            })
        assert res.status_code == 200

    @pytest.mark.asyncio
    async def test_update_user_to_a_super_admin(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="super_admin@akvo.org")
        assert user.email == "super_admin@akvo.org"
        update_payload = {
            "fullname": user.fullname,
            "organisation": user.organisation,
            "role": UserRole.super_admin.value,
            "is_active": True,
        }
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
        assert res["role"] == UserRole.super_admin.value
        assert res["active"] is True

    @pytest.mark.asyncio
    async def test_get_all_user_by_super_admin_cred(
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
                "role": UserRole.user.value,
                "active": False,
                "tags_count": 0,
                "cases_count": 0,
            }, {
                "id": 2,
                "organisation": 1,
                "email": "test_user@akvo.org",
                "fullname": "Test User",
                "role": UserRole.viewer.value,
                "active": False,
                "tags_count": 0,
                "cases_count": 0,
            }, {
                "id": 1,
                "organisation": 1,
                "email": "super_admin@akvo.org",
                "fullname": "John Doe",
                "role": UserRole.super_admin.value,
                "active": True,
                "tags_count": 0,
                "cases_count": 0,
            }],
            "total": 3,
            "total_page": 1
        }

    @pytest.mark.asyncio
    async def test_get_user_by_id_by_super_admin_cred(
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
            "email": "super_admin@akvo.org",
            "fullname": "John Doe",
            "role": UserRole.super_admin.value,
            "active": True,
            "business_unit_detail": None,
            "organisation_detail": {"id": 1, "name": "Akvo"},
            "tags_count": 0,
            "cases_count": 0,
        }

    @pytest.mark.asyncio
    async def test_delete_user_by_super_admin_cred(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # delete user by admin
        res = await client.delete(
            app.url_path_for("user:delete", user_id=3),
            headers={"Authorization": f"Bearer {account.token}"})
        assert res.status_code == 204

    @pytest.mark.asyncio
    async def test_update_user_password(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        account = Acc(email="test_user@akvo.org", token=None)
        user = get_user_by_email(session=session, email="test_user@akvo.org")
        assert user.email == "test_user@akvo.org"
        update_payload = {
            "fullname": "Sample User",
            "organisation": user.organisation,
            "is_active": True,
            "password": "secret"
        }
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
        assert res["fullname"] == "Sample User"
        assert res["role"] == user.role.value
        assert res["active"] is True
        # test login with new password
        res = await client.post(
            app.url_path_for("user:login"),
            headers={"content-type": "application/x-www-form-urlencoded"},
            data={
                "username": user.email,
                "password": "secret",
                "grant_type": "password",
                "scopes": ["openid", "email"],
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET
            })
        assert res.status_code == 200
        res = res.json()
        assert res['access_token'] is not None
        assert res['user']['email'] == user.email

    @pytest.mark.asyncio
    async def test_invite_admin_role_by_super_admin_without_business_unit(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Invited Admin",
            "email": "admin@akvo.org",
            "role": UserRole.admin.value,
            "password": None,
            "organisation": 1,
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
        assert res.status_code == 422
        res = res.json()
        assert res == {'detail': 'business_units required for admin role'}

    @pytest.mark.asyncio
    async def test_invite_admin_role_by_super_admin_with_business_unit(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user_payload = {
            "fullname": "Invited Admin",
            "email": "admin@akvo.org",
            "role": UserRole.admin.value,
            "password": None,
            "organisation": 1,
            "business_units": json.dumps([{
                "business_unit": 1,
                "role": UserBusinessUnitRole.admin.value
            }])
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
        res = res.json()
        assert res == {
            "id": 4,
            "fullname": "Invited Admin",
            "email": "admin@akvo.org",
            "organisation": 1,
            "role": UserRole.admin.value,
            "active": 0
        }
        user = get_user_by_email(session=session, email=user_payload["email"])
        assert user.invitation_id is not None
        assert user.password is None
        user_bu = session.query(UserBusinessUnit).filter(
            UserBusinessUnit.user == user.id).all()
        for ub in user_bu:
            assert ub.user == user.id
            assert ub.role.value == UserBusinessUnitRole.admin.value

    @pytest.mark.asyncio
    async def test_get_user_by_invitation_id(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(
            session=session, email="admin@akvo.org")
        res = await client.get(
            app.url_path_for(
                "user:invitation",
                invitation_id=user.invitation_id
            )
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'id': 4,
            'email': 'admin@akvo.org',
            'fullname': 'Invited Admin',
            'invitation_id': user.invitation_id,
            'role': UserRole.admin.value,
        }

    @pytest.mark.asyncio
    async def test_register_password_by_invitation_id(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(
            session=session, email="admin@akvo.org")
        res = await client.post(
            app.url_path_for(
                "user:invitation",
                invitation_id=user.invitation_id
            ),
            data={"password": "secret"}
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'access_token': res['access_token'],
            'token_type': 'bearer',
            'user': {
                'id': 4,
                'fullname': 'Invited Admin',
                'email': 'admin@akvo.org',
                'role': UserRole.admin.value,
                'active': 1,
                'business_unit_detail': [{
                    'id': 2,
                    'name': 'Acme Technologies Sales Division',
                    'role': UserBusinessUnitRole.admin.value,
                }],
                'organisation_detail': {'id': 1, 'name': 'Akvo'},
                'tags_count': 0,
                'cases_count': 0
            }
        }
