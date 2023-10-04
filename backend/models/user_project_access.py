from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class UserProjectAccess(Base):
    __tablename__ = 'user_project_access'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    project = Column(Integer, ForeignKey('project.id'), nullable=False)

    user_project_access_detail = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='user_project_access'
    )
    # project_detail = relationship(
    #     'Project',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='project_access'
    # )

    def __init__(self, id: Optional[int], user: int, project: int):
        self.id = id
        self.user = user
        self.project = project

    def __repr__(self) -> int:
        return f"<UserProjectAccess {self.id}>"


class UserProjectAccessBase(BaseModel):
    id: int
    user: int
    project: int

    class Config:
        from_attributes = True
