from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from models.segment import (
    Segment, SegmentBase, SegmentDict, SegmentUpdateBase
)
from models.segment_answer import SegmentAnswer


def add_segment(
    session: Session, payloads: List[SegmentBase]
) -> List[SegmentDict]:
    segments = []
    for payload in payloads:
        segment = Segment(
            name=payload.name,
            case=payload.case,
            target=payload.target,
            household_size=payload.household_size
        )
        session.add(segment)
        session.commit()
        session.flush()
        session.refresh(segment)
        segments.append(segment)
    return segments


def get_segment_by_id(session: Session, id: int) -> SegmentDict:
    segment = session.query(Segment).filter(Segment.id == id).first()
    if not segment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Segment {id} not found"
        )
    return segment


def update_segment(
    session: Session, payloads: List[SegmentUpdateBase]
) -> List[SegmentDict]:
    segments = []
    for payload in payloads:
        segment = get_segment_by_id(session=session, id=payload.id)
        segment.name = payload.name
        segment.case = payload.case
        segment.target = payload.target
        segment.household_size = payload.household_size
        session.commit()
        session.flush()
        session.refresh(segment)
        segments.append(segment)
    return segments


def delete_segment(session: Session, id: int):
    segment = get_segment_by_id(session=session, id=id)
    # delete segment answers
    segment_answers = (
        session.query(SegmentAnswer)
        .filter(SegmentAnswer.segment == id).all()
    )
    for sa in segment_answers:
        session.delete(sa)
    session.delete(segment)
    session.commit()
    session.flush()


def get_segments_by_case_id(
    session: Session, case_id: int
) -> List[SegmentDict]:
    segments = session.query(Segment).filter(Segment.case == case_id).all()
    if not segments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Segments with case {case_id} not found"
        )
    return segments
