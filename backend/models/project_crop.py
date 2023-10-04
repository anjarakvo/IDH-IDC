from db.connection import Base
from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class ProjectCrop(Base):
    __tablename__ = 'project_crop'

    id = Column(Integer, primary_key=True, nullable=False)
    project = Column(Integer, ForeignKey('project.id'))
    crop = Column(Integer, ForeignKey('crop.id'))
    focus_crop = Column(SmallInteger, nullable=False, default=0)
    breakdown = Column(SmallInteger, nullable=False, default=0)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='project_detail_project_crop'
    )
    crop_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='crop_detail_project_crop'
    )

    def __init__(
        self,
        project: int,
        crop: int,
        id: Optional[int] = None,
        focus_crop: Optional[int] = 0,
        breakdown: Optional[int] = 0,
    ):
        self.id = id
        self.project = project
        self.crop = crop
        self.focus_crop = focus_crop
        self.breakdown = breakdown

    def __repr__(self) -> int:
        return f"<ProjectCrop {self.id}>"


class ProjectCropBase(BaseModel):
    id: int
    project: int
    crop: int
    focus_crop: Optional[int] = 0
    breakdown: Optional[int] = 0

    class Config:
        from_attributes = True
