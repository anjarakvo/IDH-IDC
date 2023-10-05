from sqlalchemy.orm import Session
from typing import Optional, List
from typing_extensions import TypedDict

from models.tag import Tag, TagListDict, TagBase
from models.project_tag import ProjectTag


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
    if payload.projects:
        for proj in payload.projects:
            project_tag = ProjectTag(project=proj)
            tag.tag_projects.append(project_tag)
    session.add(tag)
    session.commit()
    session.flush()
    session.refresh(tag)
    return tag
