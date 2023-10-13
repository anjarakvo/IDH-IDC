import sys
import pytest

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

from models.case import LivingIncomeStudyEnum

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestCaseRoute():
    @pytest.mark.asyncio
    async def test_get_all_case_return_404(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("case:get_all"))
        assert res.status_code == 403
        res = await client.get(
            app.url_path_for("case:get_all"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_create_case(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Bali Rice and Corn Production Comparison",
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
            "other_commodities": [{"commodity": 3, "breakdown": True}]
        }
        # without cred
        res = await client.post(
            app.url_path_for("case:create"),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.post(
            app.url_path_for("case:create"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.post(
            app.url_path_for("case:create"),
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
            'focus_commodity': 2,
            'currency': 'USD',
            'area_size_unit': 'hectare',
            'volume_measurement_unit': 'liters',
            'cost_of_production_unit': 'Per-area',
            'reporting_period': 'Per-season',
            'segmentation': False,
            'living_income_study': 'better_income',
            'multiple_commodities': False,
            'logo': None,
            'created_by': 1,
            'case_commodities': [{
                'id': 1,
                'commodity': 2,
                'breakdown': True
            }, {
                'id': 2,
                'commodity': 3,
                'breakdown': True
            }]
        }

    @pytest.mark.asyncio
    async def test_get_all_case(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # with normal user cred
        res = await client.get(
            app.url_path_for("case:get_all"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # with admin user cred
        res = await client.get(
            app.url_path_for("case:get_all"),
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
                'focus_commodity': 2,
                'diversified_commodities_count': 1,
                'created_at': res["data"][0]["created_at"],
                'created_by': 'super_admin@akvo.org'
            }],
            'total': 1,
            'total_page': 1
        }

    @pytest.mark.asyncio
    async def test_update_case(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = {
            "name": "Bali Rice and Corn Production",
            "date": "2023-10-03",
            "year": 2023,
            "country": 2,
            "focus_commodity": 2,
            "currency": "USD",
            "area_size_unit": "acre",
            "volume_measurement_unit": "kilograms",
            "cost_of_production_unit": "Per-acre",
            "reporting_period": "Per-year",
            "segmentation": False,
            "living_income_study": LivingIncomeStudyEnum.living_income.value,
            "multiple_commodities": False,
            "other_commodities": [{"commodity": 3, "breakdown": False}]
        }
        # without cred
        res = await client.put(
            app.url_path_for("case:update", case_id=1),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.put(
            app.url_path_for("case:update", case_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.put(
            app.url_path_for("case:update", case_id=1),
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
            'focus_commodity': 2,
            'currency': 'USD',
            'area_size_unit': 'acre',
            'volume_measurement_unit': 'kilograms',
            'cost_of_production_unit': 'Per-acre',
            'reporting_period': 'Per-year',
            'segmentation': False,
            'living_income_study': 'living_income',
            'multiple_commodities': False,
            'logo': None,
            'created_by': 1,
            'case_commodities': [{
                'id': 1,
                'commodity': 2,
                'breakdown': True
            }, {
                'id': 2,
                'commodity': 3,
                'breakdown': False
            }]
        }

    @pytest.mark.asyncio
    async def test_get_case_by_id_without_segments(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(
            app.url_path_for("case:get_by_id", case_id=1)
        )
        assert res.status_code == 403
        # return 404
        res = await client.get(
            app.url_path_for("case:get_by_id", case_id=100),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 404
        # with normal user cred
        res = await client.get(
            app.url_path_for("case:get_by_id", case_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 401
        # with admin user cred
        res = await client.get(
            app.url_path_for("case:get_by_id", case_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == {
            'id': 1,
            'name': 'Bali Rice and Corn Production',
            'date': '2023-10-03',
            'year': 2023,
            'country': 2,
            'focus_commodity': 2,
            'currency': 'USD',
            'area_size_unit': 'acre',
            'volume_measurement_unit': 'kilograms',
            'cost_of_production_unit': 'Per-acre',
            'reporting_period': 'Per-year',
            'segmentation': False,
            'living_income_study': 'living_income',
            'multiple_commodities': False,
            'created_by': 'super_admin@akvo.org',
            'created_at': res['created_at'],
            'updated_at': res['updated_at'],
            'segments': [],
            'case_commodities': [{
                'id': 1,
                'commodity': 2,
                'breakdown': True
            }, {
                'id': 2,
                'commodity': 3,
                'breakdown': False
            }]
        }

    # TODO :: test_get_case_by_id_with_segments
