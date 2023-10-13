import enum

from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer, Enum
from typing import Optional
from pydantic import BaseModel


class UserBusinessUnitRole(enum.Enum):
    admin = "admin"
    member = "member"


class UserBusinessUnit(Base):
    __tablename__ = 'user_business_unit'

    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey('user.id'), nullable=False)
    business_unit = Column(
        Integer, ForeignKey('business_unit.id'), nullable=False)
    role = Column(Enum(UserBusinessUnitRole), nullable=False)

    def __init__(
        self,
        business_unit: int,
        role: UserBusinessUnitRole,
        id: Optional[int] = None,
        user: Optional[int] = None,
    ):
        self.id = id
        self.user = user
        self.business_unit = business_unit
        self.rolse = role

    def __repr__(self) -> int:
        return f"<UserBusinessUnit {self.id}>"


class UserBusinessUnitBase(BaseModel):
    id: int
    user: int
    business_unit: int
    role: UserBusinessUnitRole
