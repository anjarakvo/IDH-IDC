from db.connection import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import BaseModel
from models.crop_category_question import CropCategoryQuestion


class QuestionGroupParam(TypedDict):
    crop: int
    breakdown: bool


class QuestionDict(TypedDict):
    id: int
    parent: Optional[int]
    code: Optional[str]
    text: str
    description: Optional[str]
    default_value: Optional[str]
    created_by: int
    childrens: Optional[List]


class QuestionGroupListDict(TypedDict):
    crop_id: int
    crop_name: str
    questions: List[QuestionDict]


class Question(Base):
    __tablename__ = 'question'

    id = Column(Integer, primary_key=True, nullable=False)
    parent = Column(Integer, ForeignKey('question.id'))
    code = Column(String, nullable=True)
    text = Column(String, nullable=False)
    description = Column(String, nullable=True)
    default_value = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey('user.id'))

    children = relationship("Question")
    parent_detail = relationship(
        "Question", remote_side=[id], overlaps="children")
    created_by_user = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='questions'
    )
    question_crop_category_detail = relationship(
        'CropCategory',
        secondary=CropCategoryQuestion.__tablename__,
        cascade="all, delete",
        passive_deletes=True,
        back_populates='crop_category_questions'
    )

    def __init__(
        self,
        text: str,
        created_by: int,
        id: Optional[int] = None,
        parent: Optional[int] = None,
        code: Optional[str] = None,
        description: Optional[str] = None,
        default_value: Optional[str] = None,
    ):
        self.id = id
        self.parent = parent
        self.code = code
        self.text = text
        self.description = description
        self.default_value = default_value
        self.created_by = created_by

    def __repr__(self) -> int:
        return f"<Question {self.id}>"

    @property
    def serialize(self) -> QuestionDict:
        return {
            "id": self.id,
            "parent": self.parent,
            "code": self.code,
            "text": self.text,
            "description": self.description,
            "default_value": self.default_value,
            "created_by": self.created_by,
            "childrens": [],
        }

    @property
    def serialize_with_child(self) -> QuestionDict:
        childrens = [c.serialize for c in self.children]
        return {
            "id": self.id,
            "parent": self.parent,
            "code": self.code,
            "text": self.text,
            "description": self.description,
            "default_value": self.default_value,
            "created_by": self.created_by,
            "childrens": childrens,
        }


class QuestionBase(BaseModel):
    id: int
    parent: Optional[int] = None
    code: Optional[str] = None
    text: str
    description: Optional[str] = None
    default_value: Optional[str] = None
    created_by: int
