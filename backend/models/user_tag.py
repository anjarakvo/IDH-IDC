from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class UserTag(Base):
    __tablename__ = 'user_tag'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    tag = Column(Integer, ForeignKey('tag.id'), nullable=False)

    user_detail = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='user_tag'
    )
    tag_detail = relationship(
        'Tag',
        cascade="all, delete",
        passive_deletes=True,
        backref='tag_user'
    )

    def __init__(self, id: Optional[int], user: int, tag: int):
        self.id = id
        self.user = user
        self.tag = tag

    def __repr__(self) -> int:
        return f"<UserTag {self.id}>"


class UserTagBase(BaseModel):
    id: int
    user: int
    tag: int

    class Config:
        from_attributes = True
