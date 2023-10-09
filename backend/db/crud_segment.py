from sqlalchemy.orm import Session
from typing import List
# from fastapi import HTTPException, status

from models.segment import Segment, SegmentBase, SegmentDict


def add_segment(
    session: Session, payloads: List[SegmentBase]
) -> List[SegmentDict]:
    segments = []
    for payload in payloads:
        segment = Segment(
            name=payload.name,
            project=payload.project,
            target=payload.target,
            household_size=payload.household_size
        )
        session.add(segment)
        session.commit()
        session.flush()
        session.refresh(segment)
        segments.append(segment)
    return segments
