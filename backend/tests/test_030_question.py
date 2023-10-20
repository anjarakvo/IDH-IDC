import sys
import pytest

from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestQuestionRoute:
    @pytest.mark.asyncio
    async def test_get_question_by_commodity_ID(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.post(app.url_path_for("question:get_by_commodities"))
        assert res.status_code == 403
        # with non admin cred
        res = await client.post(
            app.url_path_for("question:get_by_commodities"),
            json=[
                {
                    "commodity": 1,
                    "breakdown": False,
                },
                {
                    "commodity": 2,
                    "breakdown": True,
                },
            ],
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
        )
        assert res.status_code == 200
        # test valid search
        res = await client.post(
            app.url_path_for("question:get_by_commodities"),
            json=[
                {
                    "commodity": 1,
                    "breakdown": False,
                },
                {
                    "commodity": 2,
                    "breakdown": True,
                },
            ],
            headers={"Authorization": f"Bearer {admin_account.token}"},
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [
            {
                "commodity_id": 1,
                "commodity_name": "Wheat",
                "questions": [
                    {
                        "id": 1,
                        "parent": None,
                        "unit": "Q1",
                        "question_type": "aggregator",
                        "text": "Net Income per day",
                        "description": None,
                        "default_value": "function() { return #Q2 * #Q3 / 30; }",
                        "created_by": 1,
                        "childrens": [
                            {
                                "id": 2,
                                "parent": 1,
                                "unit": "Q2",
                                "question_type": "question",
                                "question_type": "question",
                                "text": "Income from Commodity / Month",
                                "description": None,
                                "default_value": None,
                                "created_by": 1,
                                "childrens": [],
                            },
                            {
                                "id": 3,
                                "parent": 1,
                                "question_type": "question",
                                "unit": "Q3",
                                "question_type": "question",
                                "text": "Cost of Production / Month",
                                "description": None,
                                "default_value": None,
                                "created_by": 1,
                                "childrens": [],
                            },
                        ],
                    },
                ],
            },
            {
                "commodity_id": 2,
                "commodity_name": "Rice",
                "questions": [
                    {
                        "id": 1,
                        "parent": None,
                        "unit": "Q1",
                        "question_type": "aggregator",
                        "text": "Net Income per day",
                        "description": None,
                        "default_value": "function() { return #Q2 * #Q3 / 30; }",
                        "created_by": 1,
                        "childrens": [
                            {
                                "id": 2,
                                "parent": 1,
                                "question_type": "question",
                                "unit": "Q2",
                                "question_type": "question",
                                "text": "Income from Commodity / Month",
                                "description": None,
                                "default_value": None,
                                "created_by": 1,
                                "childrens": [],
                            },
                            {
                                "id": 3,
                                "parent": 1,
                                "question_type": "question",
                                "unit": "Q3",
                                "question_type": "question",
                                "text": "Cost of Production / Month",
                                "description": None,
                                "default_value": None,
                                "created_by": 1,
                                "childrens": [],
                            },
                        ],
                    },
                ],
            },
        ]
