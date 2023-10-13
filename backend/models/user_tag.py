from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel
from models.enum_type import PermissionType


class UserTag(Base):
    __tablename__ = 'user_tag'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    tag = Column(Integer, ForeignKey('tag.id'), nullable=False)
    permission = Column(Enum(PermissionType), nullable=False)

    user_tag_detail = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='user_tags'
    )
    # tag_detail = relationship(
    #     'Tag',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='tag_users'
    # )

    def __init__(
        self,
        tag: int,
        id: Optional[int] = None,
        user: Optional[int] = None,
        permission: Optional[PermissionType] = PermissionType.view
    ):
        self.id = id
        self.user = user
        self.tag = tag
        self.permission = permission

    def __repr__(self) -> int:
        return f"<UserTag {self.id}>"


class UserTagBase(BaseModel):
    id: int
    user: int
    tag: int
    permission: Optional[PermissionType] = PermissionType.view
