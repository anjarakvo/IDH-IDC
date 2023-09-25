from db.connection import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing_extensions import TypedDict
from typing import Optional
from pydantic import BaseModel


class FolderDict(TypedDict):
    id: int
    parent: Optional[int]
    name: str
    description: Optional[str]
    created_by: int


class Folder(Base):
    __tablename__ = 'folder'

    id = Column(Integer, primary_key=True, nullable=False)
    parent = Column(Integer, ForeignKey('folder.id'))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey('user.id'), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False,
        server_default=func.now(), onupdate=func.now()
    )

    children = relationship("Folder")
    parent_detail = relationship(
        "Folder", remote_side=[id], overlaps="children")
    created_by_user = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='folders'
    )

    def __init__(
        self,
        id: Optional[int],
        parent: Optional[int],
        name: str,
        description: Optional[str]
    ):
        self.id = id
        self.parent = parent
        self.name = name
        self.description = description

    def __repr__(self) -> int:
        return f"<Folder {self.id}>"

    @property
    def serialize(self) -> FolderDict:
        return {
            "id": self.id,
            "parent": self.parent,
            "name": self.name,
            "description": self.description,
            "children": self.children
        }


class FolderBase(BaseModel):
    id: int
    parent: Optional[int] = None
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True
