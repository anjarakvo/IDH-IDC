from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
# from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
# from models.question import Question


class CropCategoryQuestion(Base):
    __tablename__ = 'crop_category_question'

    id = Column(Integer, primary_key=True, nullable=False)
    crop_category = Column(Integer, ForeignKey('crop_category.id'))
    question = Column(Integer, ForeignKey('question.id'))

    # crop_category_detail = relationship(
    #     'CropCategory',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     back_populates='crop_category_questions'
    # )
    # crop_questions = relationship(
    #     Question,
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     back_populates='question_crop_category'
    # )

    def __init__(
        self,
        crop_category: int,
        id: Optional[int] = None,
        question: Optional[int] = None,
    ):
        self.id = id
        self.crop_category = crop_category
        self.question = question

    def __repr__(self) -> int:
        return f"<CropCategoryQuestion {self.id}>"


class CropCategoryQuestionBase(BaseModel):
    id: int
    crop_category: int
    question: int
