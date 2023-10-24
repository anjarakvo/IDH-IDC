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
from models.segment import SegmentBase, SegmentDict, SegmentUpdateBase


security = HTTPBearer()
segment_route = APIRouter()


@segment_route.post(
    "/segment",
    response_model=List[SegmentDict],
    summary="create segment",
    name="segment:create",
    tags=["Segment"]
)
def create_segment(
    req: Request,
    payload: List[SegmentBase],
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    segments = crud_segment.add_segment(session=session, payloads=payload)
    return [s.serialize for s in segments]


@segment_route.put(
    "/segment",
    response_model=List[SegmentDict],
    summary="update segment",
    name="segment:update",
    tags=["Segment"]
)
def update_segment(
    req: Request,
    payload: List[SegmentUpdateBase],
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    segments = crud_segment.update_segment(session=session, payloads=payload)
    return [s.serialize for s in segments]
