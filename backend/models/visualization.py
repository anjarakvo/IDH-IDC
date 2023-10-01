import enum
from db.connection import Base
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel
from sqlalchemy import Column, Integer, Enum
import sqlalchemy.dialects.postgresql as pg


class VisualizationTab(enum.Enum):
    income_overview = "income_overview"
    sensitivity_analysis = "sensitivity_analysis"
    scenario_modeling = "scenario_modeling"


class VisualizationDict(TypedDict):
    id: int
    tabs: VisualizationTab
    config: dict


class Visualization(Base):
    __tablename__ = "visualization"

    id = Column(Integer, primary_key=True, index=True, nullable=True)
    tabs = Column(
        Enum(VisualizationTab), default=VisualizationTab.income_overview)
    config = Column(pg.JSONB, nullable=False)

    def __init__(
        self,
        id: Optional[int],
        tabs: VisualizationTab,
        config: dict,
    ):
        self.id = id
        self.tabs = tabs
        self.config = config

    def __repr__(self) -> int:
        return f"<Visualization {self.id}>"

    @property
    def serialize(self) -> VisualizationDict:
        return {
            "id": self.id,
            "tabs": self.tabs,
            "config": self.config
        }


class VisualizationBase(BaseModel):
    id: int
    tabs: VisualizationTab
    config: dict

    class Config:
        from_attributes = True
