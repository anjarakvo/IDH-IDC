import db.crud_segment_answer as crud_segment_answer
import db.crud_segment as crud_segment

from fastapi import (
    APIRouter, Request, Depends
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.segment_answer import SegmentAnswerBase, SegmentAnswerDict


security = HTTPBearer()
segment_answer_route = APIRouter()


@segment_answer_route.post(
    "/segment-answer/{segment_id:path}",
    response_model=List[SegmentAnswerDict],
    summary="add segment answer/value",
    name="segment_answer:add_answer",
    tags=["Segment Answer"]
)
def add_segment_answer(
    req: Request,
    segment_id: int,
    payload: List[SegmentAnswerBase],
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    # check segment
    crud_segment.get_segment_by_id(session=session, id=segment_id)
    # add segment answers
    segment_answers = crud_segment_answer.add_segment_answer(
        session=session, payloads=payload)
    return [sa.serialize for sa in segment_answers]
