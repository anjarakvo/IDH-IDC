from db.connection import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing_extensions import TypedDict
from typing import Optional
from pydantic import BaseModel


class TagDict(TypedDict):
    id: int
    name: str
    description: Optional[str]
    created_by: int


class Tag(Base):
    __tablename__ = 'tag'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey('user.id'), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False,
        server_default=func.now(), onupdate=func.now()
    )

    created_by_user = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='Tags'
    )

    def __init__(
        self,
        id: Optional[int],
        name: str,
        description: Optional[str]
    ):
        self.id = id
        self.name = name
        self.description = description

    def __repr__(self) -> int:
        return f"<Tag {self.id}>"

    @property
    def serialize(self) -> TagDict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "children": self.children
        }


class TagBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True
