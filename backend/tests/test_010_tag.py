import sys
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="admin@akvo.org", token=None)


class TestTagRoute():
    @pytest.mark.asyncio
    async def test_get_all_tag_return_404(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("tag:get_all"))
        assert res.status_code == 403
        res = await client.get(
            app.url_path_for("tag:get_all"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_create_tag_without_project_list(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Tag 1",
            "description": "Lorem ipsum..."
        }
        # without cred
        res = await client.post(
            app.url_path_for("tag:create"),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.post(
            app.url_path_for("tag:create"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.post(
            app.url_path_for("tag:create"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 1,
            "name": "Tag 1",
            "description": "Lorem ipsum...",
            "projects_count": 0
        }

    @pytest.mark.asyncio
    async def test_get_all_tag_without_project_list(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("tag:get_all"))
        assert res.status_code == 403
        # with normal user cred
        res = await client.get(
            app.url_path_for("tag:get_all"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # with admin user cred
        res = await client.get(
            app.url_path_for("tag:get_all"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "current": 1,
            "data": [{
                "id": 1,
                "name": "Tag 1",
                "description": "Lorem ipsum...",
                "projects_count": 0
            }],
            "total": 1,
            "total_page": 1,
        }

    @pytest.mark.asyncio
    async def test_get_tag_by_id_without_project_list(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("tag:get_by_id", tag_id=1))
        assert res.status_code == 403
        # return 404
        res = await client.get(
            app.url_path_for("tag:get_by_id", tag_id=100),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # with normal user cred
        res = await client.get(
            app.url_path_for("tag:get_by_id", tag_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # with admin user cred
        res = await client.get(
            app.url_path_for("tag:get_by_id", tag_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 1,
            "name": "Tag 1",
            "description": "Lorem ipsum...",
            "projects_count": 0
        }
