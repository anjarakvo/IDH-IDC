import sys
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="admin@akvo.org", token=None)


class TestTagWithProjectsRoute():
    @pytest.mark.asyncio
    async def test_create_tag_with_projects(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Tag 2",
            "projects": [1],
        }
        # with admin user cred
        res = await client.post(
            app.url_path_for("tag:create"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 2,
            "name": "Tag 2",
            "description": None,
            "projects_count": 1
        }

    @pytest.mark.asyncio
    async def test_update_tag_with_projects(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Tag 1",
            "description": "Tag Description",
            "projects": [1],
        }
        # with admin user cred
        res = await client.put(
            app.url_path_for("tag:update", tag_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            "id": 1,
            "name": "Tag 1",
            "description": "Tag Description",
            "projects_count": 1
        }
