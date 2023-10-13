from db.connection import Base
from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
from typing_extensions import TypedDict


class SimplifiedProjectCommodityDict(TypedDict):
    id: int
    commodity: int
    breakdown: bool


class ProjectCommodity(Base):
    __tablename__ = 'project_commodity'

    id = Column(Integer, primary_key=True, nullable=False)
    project = Column(Integer, ForeignKey('project.id'))
    commodity = Column(Integer, ForeignKey('commodity.id'))
    focus_commodity = Column(SmallInteger, nullable=False, default=0)
    breakdown = Column(SmallInteger, nullable=False, default=0)

    project_detail = relationship(
        'Project',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='project_commoditys'
    )
    # commodity_detail = relationship(
    #     'Project',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='commodity_detail_project_commodity'
    # )

    def __init__(
        self,
        commodity: int,
        project: Optional[int] = None,
        id: Optional[int] = None,
        focus_commodity: Optional[int] = 0,
        breakdown: Optional[int] = 0,
    ):
        self.id = id
        self.project = project
        self.commodity = commodity
        self.focus_commodity = focus_commodity
        self.breakdown = breakdown

    def __repr__(self) -> int:
        return f"<ProjectCommodity {self.id}>"

    @property
    def simplify(self):
        return {
            "id": self.id,
            "commodity": self.commodity,
            "breakdown": self.breakdown
        }


class ProjectCommodityBase(BaseModel):
    id: int
    project: int
    commodity: int
    focus_commodity: Optional[int] = 0
    breakdown: Optional[int] = 0
