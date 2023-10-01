from db.connection import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class QuestionDict(TypedDict):
    id: int
    parent: Optional[int]
    code: Optional[str]
    text: str
    description: Optional[str]
    default_value: Optional[str]
    created_by: int


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

    def __init__(
        self,
        id: Optional[int],
        parent: Optional[int],
        code: Optional[str],
        text: str,
        description: Optional[str],
        default_value: Optional[str],
        created_by: int,
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
    def serializer(self) -> QuestionDict:
        return {
            "id": self.id,
            "parent": self.parent,
            "code": self.code,
            "text": self.text,
            "description": self.description,
            "default_value": self.default_value,
            "created_by": self.created_by,
        }


class QuestionBase(BaseModel):
    id: int
    parent: Optional[int] = None
    code: Optional[str] = None
    text: str
    description: Optional[str] = None
    default_value: Optional[str] = None
    created_by: int

    class Config:
        from_attributes = True
