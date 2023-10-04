import enum
from db.connection import Base
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel
from sqlalchemy import Column, Integer, Enum, ForeignKey
import sqlalchemy.dialects.postgresql as pg
from sqlalchemy.orm import relationship


class VisualizationTab(enum.Enum):
    sensitivity_analysis = "sensitivity_analysis"
    scenario_modeling = "scenario_modeling"


class VisualizationDict(TypedDict):
    id: int
    project: int
    segment: int
    tab: VisualizationTab
    config: dict


class Visualization(Base):
    __tablename__ = "visualization"

    id = Column(Integer, primary_key=True, index=True, nullable=True)
    project = Column(Integer, ForeignKey('project.id'))
    segment = Column(Integer, ForeignKey('segment.id'))
    tab = Column(
        Enum(VisualizationTab), default=VisualizationTab.sensitivity_analysis)
    config = Column(pg.JSONB, nullable=False)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        backref='project_visualization'
    )
    segment_detail = relationship(
        'Segment',
        cascade="all, delete",
        passive_deletes=True,
        backref='segment_visualization'
    )

    def __init__(
        self,
        project: int,
        segment: int,
        tab: VisualizationTab,
        config: dict,
        id: Optional[int] = None,
    ):
        self.id = id
        self.project = project
        self.segment = segment
        self.tab = tab
        self.config = config

    def __repr__(self) -> int:
        return f"<Visualization {self.id}>"

    @property
    def serialize(self) -> VisualizationDict:
        return {
            "id": self.id,
            "project": self.project,
            "segment": self.segment,
            "tab": self.tab,
            "config": self.config
        }


class VisualizationBase(BaseModel):
    id: int
    project: int
    segment: int
    tab: VisualizationTab
    config: dict

    class Config:
        from_attributes = True
