from db.connection import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CommodityDict(TypedDict):
    id: int
    commodity_category: int
    name: str


class SimplifiedCommodityDict(TypedDict):
    id: int
    name: str


class Commodity(Base):
    __tablename__ = 'commodity'

    id = Column(Integer, primary_key=True)
    commodity_category = Column(Integer, ForeignKey('commodity_category.id'))
    name = Column(String, nullable=False, unique=True)

    commodity_category_detail = relationship(
        'CommodityCategory',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='commodities'
    )

    def __init__(
        self,
        name: str,
        commodity_category: Optional[int] = None,
        id: Optional[int] = None,
    ):
        self.id = id
        self.commodity_category = commodity_category
        self.name = name

    def __repr__(self) -> int:
        return f"<Commodity {self.id}>"

    @property
    def serialize(self) -> CommodityDict:
        return {
            "id": self.id,
            "commodity_category": self.commodity_category,
            "name": self.name,
        }

    @property
    def simplify(self) -> SimplifiedCommodityDict:
        return {
            "id": self.id,
            "name": self.name,
        }

    @property
    def to_question_list(self):
        questions = self.commodity_category_detail.commodity_category_questions
        return {
            "commodity_id": self.id,
            "commodity_name": self.name,
            "questions": questions,
        }


class CommodityBase(BaseModel):
    id: int
    commodity_category: int
    name: str
