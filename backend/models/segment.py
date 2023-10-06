from db.connection import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class SegmentDict(TypedDict):
    id: int
    project: int
    name: str
    target: Optional[float]
    household_size: Optional[float]


class SimplifiedSegmentDict(TypedDict):
    id: int
    name: str
    target: Optional[float]
    household_size: Optional[float]


class Segment(Base):
    __tablename__ = 'segment'

    id = Column(Integer, primary_key=True, nullable=False)
    project = Column(Integer, ForeignKey('project.id'))
    name = Column(String, nullable=False)
    target = Column(Float, nullable=True)
    household_size = Column(Float, nullable=True)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='project_segments'
    )

    def __init__(
        self,
        id: Optional[int],
        project: int,
        name: str,
        target: Optional[float],
        household_size: Optional[float],
    ):
        self.id = id
        self.project = project
        self.name = name
        self.target = target
        self.household_size = household_size

    def __repr__(self) -> int:
        return f"<Segment {self.id}>"

    @property
    def serializer(self) -> SegmentDict:
        return {
            "id": self.id,
            "project": self.project,
            "name": self.name,
            "target": self.target,
            "household_size": self.household_size,
        }

    @property
    def simplify(self) -> SimplifiedSegmentDict:
        return {
            "id": self.id,
            "name": self.name,
            "target": self.target,
            "household_size": self.household_size,
        }


class SegmentBase(BaseModel):
    id: int
    project: int
    name: str
    target: Optional[float] = None
    household_size: Optional[float] = None
