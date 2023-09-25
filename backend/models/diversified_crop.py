from db.connection import Base
from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class DiversifiedCrop(Base):
    __tablename__ = 'diversified_crop'

    id = Column(Integer, primary_key=True, nullable=False)
    project = Column(Integer, ForeignKey('project.id'))
    crop = Column(Integer, ForeignKey('crop.id'))
    breakdown = Column(Boolean, nullable=False)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='project_diversified_crop'
    )
    crop_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='crop_diversified'
    )

    def __init__(
        self,
        id: Optional[int],
        project: int,
        crop: int,
        breakdown: bool
    ):
        self.id = id
        self.project = project
        self.crop = crop
        self.breakdown = breakdown

    def __repr__(self) -> int:
        return f"<DiversifiedCrop {self.id}>"


class DiversifiedCropBase(BaseModel):
    id: int
    project: int
    crop: int
    breakdown: bool

    class Config:
        orm_mode = True
