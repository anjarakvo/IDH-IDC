from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel


class UserCaseAccess(Base):
    __tablename__ = 'user_case_access'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    case = Column(Integer, ForeignKey('case.id'), nullable=False)

    user_case_access_detail = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='user_case_access'
    )
    # case_detail = relationship(
    #     'Case',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='case_access'
    # )

    def __init__(
        self,
        case: int,
        id: Optional[int] = None,
        user: Optional[int] = None,
    ):
        self.id = id
        self.user = user
        self.case = case

    def __repr__(self) -> int:
        return f"<UserCaseAccess {self.id}>"


class UserCaseAccessBase(BaseModel):
    id: int
    user: int
    case: int
