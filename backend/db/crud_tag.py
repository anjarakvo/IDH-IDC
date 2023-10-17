from sqlalchemy.orm import Session
from typing import Optional, List
from typing_extensions import TypedDict
from fastapi import HTTPException, status

from models.tag import Tag, TagListDict, TagBase, UpdateTagBase
from models.case_tag import CaseTag


class PaginatedTagData(TypedDict):
    count: int
    data: List[TagListDict]


def get_all_tag(
    session: Session,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
) -> List[TagListDict]:
    tag = session.query(Tag)
    if search:
        tag = tag.filter(
            Tag.name.ilike("%{}%".format(search.lower().strip()))
        )
    count = tag.count()
    tag = tag.order_by(Tag.id.desc()).offset(skip).limit(limit).all()
    return PaginatedTagData(count=count, data=tag)


def add_tag(session: Session, payload: TagBase) -> TagListDict:
    tag = Tag(
        name=payload.name,
        description=payload.description
    )
    if payload.cases:
        for proj in payload.cases:
            case_tag = CaseTag(case=proj)
            tag.tag_cases.append(case_tag)
    session.add(tag)
    session.commit()
    session.flush()
    session.refresh(tag)
    return tag


def get_tag_by_id(session: Session, id: int) -> TagListDict:
    tag = session.query(Tag).filter(Tag.id == id).first()
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag {id} not found"
        )
    return tag


def update_tag(
    session: Session, id: int, payload: UpdateTagBase
) -> TagListDict:
    tag = get_tag_by_id(session=session, id=id)
    tag.name = payload.name
    tag.description = payload.description
    if payload.cases:
        # delete previous case tag then add new tag
        session.query(CaseTag).filter(CaseTag.tag == tag.id).delete()
        for proj in payload.cases:
            case_tag = CaseTag(case=proj, tag=tag.id)
            tag.tag_cases.append(case_tag)
    session.commit()
    session.flush()
    session.refresh(tag)
    return tag
