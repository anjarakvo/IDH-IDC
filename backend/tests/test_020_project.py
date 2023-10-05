import sys
import pytest

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

from models.project import LivingIncomeStudyEnum

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="admin@akvo.org", token=None)


class TestProjectRoute():
    @pytest.mark.asyncio
    async def test_get_all_project_return_404(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("project:get_all"))
        assert res.status_code == 403
        res = await client.get(
            app.url_path_for("project:get_all"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_create_project(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Bali Rice and Corn Production Comparison",
            "date": "2023-10-03",
            "year": 2023,
            "country": 2,
            "focus_crop": 2,
            "currency": "USD",
            "area_size_unit": "hectare",
            "volume_measurement_unit": "liters",
            "cost_of_production_unit": "Per-area",
            "reporting_period": "Per-season",
            "segmentation": False,
            "living_income_study": LivingIncomeStudyEnum.better_income.value,
            "multiple_crops": False,
            "other_crops": [{"crop": 3, "breakdown": True}]
        }
        # without cred
        res = await client.post(
            app.url_path_for("project:create"),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.post(
            app.url_path_for("project:create"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.post(
            app.url_path_for("project:create"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'id': 1,
            'name': 'Bali Rice and Corn Production Comparison',
            'date': '2023-10-03',
            'year': 2023,
            'country': 2,
            'focus_crop': 2,
            'currency': 'USD',
            'area_size_unit': 'hectare',
            'volume_measurement_unit': 'liters',
            'cost_of_production_unit': 'Per-area',
            'reporting_period': 'Per-season',
            'segmentation': False,
            'living_income_study': 'better_income',
            'multiple_crops': False,
            'logo': None,
            'created_by': 1,
            'project_crops': [{
                'id': 1,
                'crop': 2,
                'breakdown': True
            }, {
                'id': 2,
                'crop': 3,
                'breakdown': True
            }]
        }

    @pytest.mark.asyncio
    async def test_get_all_project(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # with normal user cred
        res = await client.get(
            app.url_path_for("project:get_all"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # with admin user cred
        res = await client.get(
            app.url_path_for("project:get_all"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'current': 1,
            'data': [{
                'id': 1,
                'name': 'Bali Rice and Corn Production Comparison',
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
    async def test_update_project(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Bali Rice and Corn Production",
            "date": "2023-10-03",
            "year": 2023,
            "country": 2,
            "focus_crop": 2,
            "currency": "USD",
            "area_size_unit": "acre",
            "volume_measurement_unit": "kilograms",
            "cost_of_production_unit": "Per-acre",
            "reporting_period": "Per-year",
            "segmentation": False,
            "living_income_study": LivingIncomeStudyEnum.living_income.value,
            "multiple_crops": False,
            "other_crops": [{"crop": 3, "breakdown": False}]
        }
        # without cred
        res = await client.put(
            app.url_path_for("project:update", project_id=1),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.put(
            app.url_path_for("project:update", project_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.put(
            app.url_path_for("project:update", project_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'id': 1,
            'name': 'Bali Rice and Corn Production',
            'date': '2023-10-03',
            'year': 2023,
            'country': 2,
            'focus_crop': 2,
            'currency': 'USD',
            'area_size_unit': 'acre',
            'volume_measurement_unit': 'kilograms',
            'cost_of_production_unit': 'Per-acre',
            'reporting_period': 'Per-year',
            'segmentation': False,
            'living_income_study': 'living_income',
            'multiple_crops': False,
            'logo': None,
            'created_by': 1,
            'project_crops': [{
                'id': 1,
                'crop': 2,
                'breakdown': True
            }, {
                'id': 2,
                'crop': 3,
                'breakdown': False
            }]
        }
