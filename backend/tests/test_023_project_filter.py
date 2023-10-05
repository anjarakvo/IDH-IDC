import sys
import pytest

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="admin@akvo.org", token=None)


class TestProjectWithFilterRoute():
    @pytest.mark.asyncio
    async def test_get_project_filter_by_search(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # test invalid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"search": "Lombok"},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # test valid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"search": "Bali Rice"},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 1,
                'name': 'Bali Rice and Corn Production',
                'country': 2,
                'focus_crop': 2,
                'diversified_crops_count': 1,
                'created_at': res["data"][0]["created_at"],
                'created_by': 'admin@akvo.org'
            }],
            'total': 1,
            'total_page': 1
        }

    @pytest.mark.asyncio
    async def test_get_project_filter_by_tags(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # test invalid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"tags": [100, 200]},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # test valid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"tags": [1, 2]},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 1,
                'name': 'Bali Rice and Corn Production',
                'country': 2,
                'focus_crop': 2,
                'diversified_crops_count': 1,
                'created_at': res["data"][0]["created_at"],
                'created_by': 'admin@akvo.org'
            }],
            'total': 1,
            'total_page': 1
        }

    @pytest.mark.asyncio
    async def test_get_project_filter_by_focus_Crop(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # test invalid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"focus_crop": [100]},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # test valid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={"focus_crop": [2]},
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 1,
                'name': 'Bali Rice and Corn Production',
                'country': 2,
                'focus_crop': 2,
                'diversified_crops_count': 1,
                'created_at': res["data"][0]["created_at"],
                'created_by': 'admin@akvo.org'
            }],
            'total': 1,
            'total_page': 1
        }

    @pytest.mark.asyncio
    async def test_get_project_combined_filter(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # test invalid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={
                "search": "Rice",
                "tags": [1],
                "focus_crop": [100]
            },
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # test valid search
        res = await client.get(
            app.url_path_for("project:get_all"),
            params={
                "search": "Rice",
                "tags": [1],
                "focus_crop": [2]
            },
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 1,
                'name': 'Bali Rice and Corn Production',
                'country': 2,
                'focus_crop': 2,
                'diversified_crops_count': 1,
                'created_at': res["data"][0]["created_at"],
                'created_by': 'admin@akvo.org'
            }],
            'total': 1,
            'total_page': 1
        }
