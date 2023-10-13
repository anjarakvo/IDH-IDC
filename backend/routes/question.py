import db.crud_question as crud_question

from fastapi import (
    APIRouter, Request, Depends, Body
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.question import (
    QuestionGroupParam, QuestionGroupListDict
)

security = HTTPBearer()
question_route = APIRouter()


@question_route.post(
    "/questions",
    response_model=List[QuestionGroupListDict],
    summary="get question by commodity ID",
    name="question:get_by_commoditys",
    tags=["Question"]
)
def get_question_by_commodity_id(
    req: Request,
    payload: List[QuestionGroupParam] = Body(),
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    questions = crud_question.get_question_by_commodity(
        session=session, params=payload
    )
    return questions
