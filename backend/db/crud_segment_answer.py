from sqlalchemy.orm import Session
from typing import List
# from fastapi import HTTPException, status

from models.segment_answer import (
    SegmentAnswer, SegmentAnswerBase, SegmentAnswerDict
)


def add_segment_answer(
    session: Session, payloads: List[SegmentAnswerBase]
) -> List[SegmentAnswerDict]:
    segment_answers = []
    for payload in payloads:
        segment_answer = SegmentAnswer(
            project_crop=payload.project_crop,
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
