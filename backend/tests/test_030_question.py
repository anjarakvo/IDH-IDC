import sys
import pytest

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestQuestionRoute():
    @pytest.mark.asyncio
    async def test_get_question_by_crop_ID(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.post(app.url_path_for("question:get_by_crops"))
        assert res.status_code == 403
        # with non admin cred
        res = await client.post(
            app.url_path_for("question:get_by_crops"),
            json=[{
                "crop": 1,
                "breakdown": False,
            }, {
                "crop": 2,
                "breakdown": True,
            }],
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # test valid search
        res = await client.post(
            app.url_path_for("question:get_by_crops"),
            json=[{
                "crop": 1,
                "breakdown": False,
            }, {
                "crop": 2,
                "breakdown": True,
            }],
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'crop_id': 1,
            'crop_name': 'Wheat',
            'questions': [{
                'id': 1,
                'parent': None,
                'code': 'Q1',
                'text': 'Net Income per day',
                'description': None,
                'default_value': 'function() { return #Q2 * #Q3 / 30; }',
                'created_by': 1,
                'childrens': []
            }, {
                'id': 2,
                'parent': None,
                'code': 'Q2',
                'text': 'Income from Crop / Month',
                'description': None,
                'default_value': None,
                'created_by': 1,
                'childrens': []
            }, {
                'id': 3,
                'parent': None,
                'code': 'Q3',
                'text': 'Cost of Production / Month',
                'description': None,
                'default_value': None,
                'created_by': 1,
                'childrens': []
            }]
        }, {
            'crop_id': 2,
            'crop_name': 'Rice',
            'questions': [{
                'id': 1,
                'parent': None,
                'code': 'Q1',
                'text': 'Net Income per day',
                'description': None,
                'default_value': 'function() { return #Q2 * #Q3 / 30; }',
                'created_by': 1,
                'childrens': []
            }, {
                'id': 2,
                'parent': None,
                'code': 'Q2',
                'text': 'Income from Crop / Month',
                'description': None,
                'default_value': None,
                'created_by': 1,
                'childrens': []
            }, {
                'id': 3,
                'parent': None,
                'code': 'Q3',
                'text': 'Cost of Production / Month',
                'description': None,
                'default_value': None,
                'created_by': 1,
                'childrens': []
            }]
        }]
