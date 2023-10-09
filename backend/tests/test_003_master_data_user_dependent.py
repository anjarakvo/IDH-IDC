import os
import sys
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from sqlalchemy.orm import Session
from models.question import Question
from models.crop_category_question import CropCategoryQuestion
from db.crud_user import get_user_by_email

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)


class TestAddMasterDataDedenpentToUser():
    @pytest.mark.asyncio
    async def test_add_question_master_data(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        user = get_user_by_email(session=session, email="admin@akvo.org")
        assert user.id is not None
        payload = [{
            "parent_id": None,
            "code": "Q1",
            "text": "Net Income per day",
            "description": None,
            "default_value": "function() { return #Q2 * #Q3 / 30; }",
        }, {
            "parent_id": None,
            "code": "Q2",
            "text": "Income from Crop / Month",
            "description": None,
            "default_value": None,
        }, {
            "parent_id": None,
            "code": "Q3",
            "text": "Cost of Production / Month",
            "description": None,
            "default_value": None,
        }]
        for val in payload:
            question = Question(
                parent=val["parent_id"],
                code=val["code"],
                text=val["text"],
                description=val["description"],
                default_value=val["default_value"],
                created_by=user.id
            )
            session.add(question)
            session.commit()
            session.flush()
            session.refresh(question)
            # add crop cateqory question
            crop_category_question = CropCategoryQuestion(
                crop_category=1,
                question=question.id
            )
            session.add(crop_category_question)
            session.commit()
            session.flush()
            session.refresh(crop_category_question)
        # expect
        crop_category_questions = session.query(CropCategoryQuestion).all()
        assert crop_category_questions is not None
        questions = session.query(Question).all()
        questions = [q.serialize for q in questions]
        assert questions == [{
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
