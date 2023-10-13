from db.connection import Base
from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
from typing_extensions import TypedDict


class SimplifiedCaseCommodityDict(TypedDict):
    id: int
    commodity: int
    breakdown: bool


class CaseCommodity(Base):
    __tablename__ = 'case_commodity'

    id = Column(Integer, primary_key=True, nullable=False)
    case = Column(Integer, ForeignKey('case.id'))
    commodity = Column(Integer, ForeignKey('commodity.id'))
    focus_commodity = Column(SmallInteger, nullable=False, default=0)
    breakdown = Column(SmallInteger, nullable=False, default=0)

    case_detail = relationship(
        'Case',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='case_commodities'
    )
    # commodity_detail = relationship(
    #     'Case',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='commodity_detail_case_commodity'
    # )

    def __init__(
        self,
        commodity: int,
        case: Optional[int] = None,
        id: Optional[int] = None,
        focus_commodity: Optional[int] = 0,
        breakdown: Optional[int] = 0,
    ):
        self.id = id
        self.case = case
        self.commodity = commodity
        self.focus_commodity = focus_commodity
        self.breakdown = breakdown

    def __repr__(self) -> int:
        return f"<CaseCommodity {self.id}>"

    @property
    def simplify(self):
        return {
            "id": self.id,
            "commodity": self.commodity,
            "breakdown": self.breakdown
        }


class CaseCommodityBase(BaseModel):
    id: int
    case: int
    commodity: int
    focus_commodity: Optional[int] = 0
    breakdown: Optional[int] = 0
