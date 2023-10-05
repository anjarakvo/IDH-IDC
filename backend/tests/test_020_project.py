import sys
import pytest
import datetime

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

from models.project import LivingIncomeStudyEnum

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="admin@akvo.org", token=None)

current_date = datetime.date.today()


class TestProjectRoute():
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
