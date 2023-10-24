import sys
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

from models.segment import Segment
from models.segment_answer import SegmentAnswer
from models.case_commodity import CaseCommodityType

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestSegmentAnswerRoute():
    # test_get_all_segment_answer_return_404
    @pytest.mark.asyncio
    async def test_add_segment_answer(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = [{
            "case_commodity": 1,
            "segment": 100,
            "question": 1,
            "current_value": 10000,
            "feasible_value": None,
        }]
        # without cred
        res = await client.post(
            app.url_path_for("segment_answer:add_answer", segment_id=100),
            json=payload,
        )
        assert res.status_code == 403
        # wrong segment id
        res = await client.post(
            app.url_path_for("segment_answer:add_answer", segment_id=100),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 404
        # with normal user cred
        payload = [{
            "case_commodity": 1,
            "segment": 1,
            "question": 1,
            "current_value": 10000,
            "feasible_value": 5000,
        }, {
            "case_commodity": 1,
            "segment": 1,
            "question": 2,
            "current_value": 20000,
            "feasible_value": 10000,
        }]
        res = await client.post(
            app.url_path_for("segment_answer:add_answer", segment_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 1,
            'case_commodity': 1,
            'segment': 1,
            'question': 1,
            'current_value': 10000.0,
            'feasible_value': 5000.0
        }, {
            'id': 2,
            'case_commodity': 1,
            'segment': 1,
            'question': 2,
            'current_value': 20000.0,
            'feasible_value': 10000.0
        }]
        # with admin user cred
        payload = [{
            "case_commodity": 1,
            "segment": 1,
            "question": 3,
            "current_value": 30000,
            "feasible_value": 20000,
        }]
        res = await client.post(
            app.url_path_for("segment_answer:add_answer", segment_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 3,
            'case_commodity': 1,
            'segment': 1,
            'question': 3,
            'current_value': 30000.0,
            'feasible_value': 20000.0
        }]

    # test_get_all_segment_answer
    # test_get_segment_answer_by_id

    @pytest.mark.asyncio
    async def test_update_segment_answer(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = [{
            "case_commodity": 1,
            "segment": 100,
            "question": 1,
            "current_value": 100,
            "feasible_value": None,
        }]
        # without cred
        res = await client.put(
            app.url_path_for("segment_answer:update_answer", segment_id=100),
            json=payload,
        )
        assert res.status_code == 403
        # wrong segment id
        res = await client.put(
            app.url_path_for("segment_answer:update_answer", segment_id=100),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 404
        # with normal user cred
        payload = [{
            "case_commodity": 1,
            "segment": 1,
            "question": 1,
            "current_value": 5,
            "feasible_value": 5,
        }]
        res = await client.put(
            app.url_path_for("segment_answer:update_answer", segment_id=1),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 4,
            'case_commodity': 1,
            'segment': 1,
            'question': 1,
            'current_value': 5.0,
            'feasible_value': 5.0
        }]
        # with admin user cred
        payload = [{
            "case_commodity": 1,
            "segment": 1,
            "question": 1,
            "current_value": 100,
            "feasible_value": 100,
        }, {
            "case_commodity": 1,
            "segment": 1,
            "question": 2,
            "current_value": 200,
            "feasible_value": 200,
        }, {
            "case_commodity": 1,
            "segment": 1,
            "question": 3,
            "current_value": 300,
            "feasible_value": 300,
        }]
        res = await client.put(
            app.url_path_for("segment_answer:update_answer", segment_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 5,
            'case_commodity': 1,
            'segment': 1,
            'question': 1,
            'current_value': 100.0,
            'feasible_value': 100.0
        }, {
            'id': 6,
            'case_commodity': 1,
            'segment': 1,
            'question': 2,
            'current_value': 200.0,
            'feasible_value': 200.0
        }, {
            'id': 7,
            'case_commodity': 1,
            'segment': 1,
            'question': 3,
            'current_value': 300.0,
            'feasible_value': 300.0
        }]

    # TODO :: test_get_case_by_id_with_segments
    @pytest.mark.asyncio
    async def test_get_case_by_id_with_segments(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(app.url_path_for("case:get_by_id", case_id=1))
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
            "id": 1,
            "name": "Bali Rice and Corn Production",
            "description": "This is a description",
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
            "living_income_study": "living_income",
            "multiple_commodities": False,
            "created_by": "super_admin@akvo.org",
            "created_at": res["created_at"],
            "updated_at": res["updated_at"],
            "segments": [{
                'id': 2,
                'case': 1,
                'name': 'Segment 2',
                'target': 2000.0,
                'household_size': 50.0
            }, {
                'id': 3,
                'case': 1,
                'name': 'Segment 3',
                'target': 3000.0,
                'household_size': 40.0
            }, {
                'id': 1,
                'case': 1,
                'name': 'Segment 1',
                'target': 2000.0,
                'household_size': 100.0
            }],
            "case_commodities": [
                {
                    "id": 1,
                    "commodity": 2,
                    "breakdown": True,
                    "commodity_type": CaseCommodityType.focus.value,
                    "area_size_unit": "hectare",
                    "volume_measurement_unit": "liters",
                },
                {
                    "id": 2,
                    "commodity": 3,
                    "breakdown": False,
                    "commodity_type": CaseCommodityType.secondary.value,
                    "area_size_unit": "hectare",
                    "volume_measurement_unit": "liters",
                },
                {
                    "id": 3,
                    "commodity": None,
                    "breakdown": True,
                    "commodity_type": CaseCommodityType.diversified.value,
                    "volume_measurement_unit": "liters",
                    "area_size_unit": "hectare",
                },
            ],
            "private": False,
            "tags": [2, 1],
        }

    @pytest.mark.asyncio
    async def test_delete_segment_by_id_with_segment_answers(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # delete without cred
        res = await client.delete(
            app.url_path_for("segment:delete", segment_id=1))
        assert res.status_code == 403
        # delete with cred
        res = await client.delete(
            app.url_path_for("segment:delete", segment_id=1),
            headers={"Authorization": f"Bearer {admin_account.token}"})
        assert res.status_code == 204
        segment = session.query(Segment).filter(Segment.id == 1).first()
        assert segment is None
        segment_answers = (
            session.query(SegmentAnswer)
            .filter(SegmentAnswer.segment == 1).count()
        )
        assert segment_answers == 0
