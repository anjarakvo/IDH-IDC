from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class UserFolderAccess(Base):
    __tablename__ = 'user_folder_access'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    folder = Column(Integer, ForeignKey('folder.id'), nullable=False)

    user_detail = relationship(
        'Folder',
        cascade="all, delete",
        passive_deletes=True,
        backref='user_access'
    )
    folder_detail = relationship(
        'Folder',
        cascade="all, delete",
        passive_deletes=True,
        backref='folder_access'
    )

    def __init__(self, id: Optional[int], user: int, folder: int):
        self.id = id
        self.user = user
        self.folder = folder

    def __repr__(self) -> int:
        return f"<UserFolderAccess {self.id}>"


class UserFolderAccessBase(BaseModel):
    id: int
    user: int
    folder: int

    class Config:
        orm_mode = True
