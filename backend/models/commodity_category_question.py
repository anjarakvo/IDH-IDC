from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
# from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
# from models.question import Question


class CommodityCategoryQuestion(Base):
    __tablename__ = 'commodity_category_question'

    id = Column(Integer, primary_key=True, nullable=False)
    commodity_category = Column(Integer, ForeignKey('commodity_category.id'))
    question = Column(Integer, ForeignKey('question.id'))

    # commodity_category_detail = relationship(
    #     'CommodityCategory',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     back_populates='commodity_category_questions'
    # )
    # commodity_questions = relationship(
    #     Question,
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     back_populates='question_commodity_category'
    # )

    def __init__(
        self,
        commodity_category: int,
        id: Optional[int] = None,
        question: Optional[int] = None,
    ):
        self.id = id
        self.commodity_category = commodity_category
        self.question = question

    def __repr__(self) -> int:
        return f"<CommodityCategoryQuestion {self.id}>"


class CommodityCategoryQuestionBase(BaseModel):
    id: int
    commodity_category: int
    question: int
