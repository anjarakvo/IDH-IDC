from db.connection import Base
from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
from typing_extensions import TypedDict


class SimplifiedProjectCropDict(TypedDict):
    id: int
    crop: int
    breakdown: bool


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
        back_populates='project_crops'
    )
    # crop_detail = relationship(
    #     'Project',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='crop_detail_project_crop'
    # )

    def __init__(
        self,
        crop: int,
        project: Optional[int] = None,
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

    @property
    def simplify(self):
        return {
            "id": self.id,
            "crop": self.crop,
            "breakdown": self.breakdown
        }


class ProjectCropBase(BaseModel):
    id: int
    project: int
    crop: int
    focus_crop: Optional[int] = 0
    breakdown: Optional[int] = 0
