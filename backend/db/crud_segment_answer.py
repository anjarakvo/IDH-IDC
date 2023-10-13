from sqlalchemy.orm import Session
from typing import List
# from fastapi import HTTPException, status

from models.segment_answer import (
    SegmentAnswer, SegmentAnswerBase, SegmentAnswerDict
)
from db.crud_segment import get_segment_by_id


def add_segment_answer(
    session: Session, payloads: List[SegmentAnswerBase], segment_id: int
) -> List[SegmentAnswerDict]:
    # check segment
    get_segment_by_id(session=session, id=segment_id)
    segment_answers = []
    for payload in payloads:
        segment_answer = SegmentAnswer(
            project_commodity=payload.project_commodity,
            segment=payload.segment,
            question=payload.question,
            current_value=payload.current_value,
            feasible_value=payload.feasible_value,
        )
        session.add(segment_answer)
        session.commit()
        session.flush()
        session.refresh(segment_answer)
        segment_answers.append(segment_answer)
    return segment_answers


def delete_previous_segment_answer_by_segment_id(
    session: Session, segment_id: int
):
    # check segment
    get_segment_by_id(session=session, id=segment_id)
    segment_answers = session.query(SegmentAnswer).filter(
        SegmentAnswer.segment == segment_id).all()
    for sa in segment_answers:
        session.delete(sa)
    session.commit()
    session.flush()
