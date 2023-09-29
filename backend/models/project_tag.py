from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class ProjectTag(Base):
    __tablename__ = 'project_tag'

    id = Column(Integer, primary_key=True, nullable=False)
    project = Column(Integer, ForeignKey('project.id'), nullable=False)
    tag = Column(Integer, ForeignKey('tag.id'), nullable=False)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='project_tag'
    )
    tag_detail = relationship(
        'Tag',
        cascade="all, delete",
        passive_deletes=True,
        backref='tag_project'
    )

    def __init__(self, id: Optional[int], project: int, tag: int):
        self.id = id
        self.project = project
        self.tag = tag

    def __repr__(self) -> int:
        return f"<ProjectTag {self.id}>"


class projectTagBase(BaseModel):
    id: int
    project: int
    tag: int

    class Config:
        from_attributes = True
