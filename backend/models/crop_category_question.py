from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class CropCategoryQuestion(Base):
    __tablename__ = 'crop_category_question'

    id = Column(Integer, primary_key=True, nullable=False)
    crop_category = Column(Integer, ForeignKey('crop_category.id'))
    question = Column(Integer, ForeignKey('question.id'))

    crop_category_detail = relationship(
        'CropCategory',
        cascade="all, delete",
        passive_deletes=True,
        backref='crop_category_question'
    )
    question_detail = relationship(
        'Question',
        cascade="all, delete",
        passive_deletes=True,
        backref='question_crop_category_detail'
    )

    def __init__(self, id: Optional[int], crop_category: int, question: int):
        self.id = id
        self.crop_category = crop_category
        self.question = question

    def __repr__(self) -> int:
        return f"<CropCategoryQuestion {self.id}>"


class CropCategoryQuestionBase(BaseModel):
    id: int
    crop_category: int
    question: int

    class Config:
        from_attributes = True
