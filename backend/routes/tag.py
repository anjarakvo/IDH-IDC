import db.crud_tag as crud_tag

from math import ceil
from fastapi import (
    APIRouter, Request, Depends, HTTPException
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
from typing import Optional

from db.connection import get_session
from models.tag import (
    PaginatedTagResponse, TagListDict, TagBase
)
from middleware import verify_admin

security = HTTPBearer()
tag_route = APIRouter()


@tag_route.get(
    "/tag",
    response_model=PaginatedTagResponse,
    summary="get all tags",
    name="tag:get_all",
    tags=["Tag"]
)
def get_all(
    req: Request,
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    tags = crud_tag.get_all_tag(
        session=session,
        search=search,
        skip=(limit * (page - 1)),
        limit=limit
    )
    if not tags:
        raise HTTPException(status_code=404, detail="Not found")
    total = tags["count"]
    tags = [tag.to_tag_list for tag in tags["data"]]
    total_page = ceil(total / limit) if total > 0 else 0
    if total_page < page:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        'current': page,
        'data': tags,
        'total': total,
        'total_page': total_page
    }


@tag_route.post(
    "/tag",
    response_model=TagListDict,
    summary="create tag",
    name="tag:create",
    tags=["Tag"]
)
def create_tag(
    req: Request,
    payload: TagBase,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_admin(session=session, authenticated=req.state.authenticated)
    tag = crud_tag.add_tag(session=session, payload=payload)
    return tag.to_tag_list
