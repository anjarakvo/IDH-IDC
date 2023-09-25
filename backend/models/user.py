from db.connection import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class UserDict(TypedDict):
    id: int
    organisation: int
    email: str
    fullname: str
    active: bool


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    organisation = Column(Integer, ForeignKey('organisation.id'))
    email = Column(String, nullable=False, unique=True)
    fullname = Column(String, nullable=False)
    password = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(),
        onupdate=func.now()
    )

    user_organisation = relationship(
        'Organisation',
        cascade="all, delete",
        passive_deletes=True,
        backref='users'
    )

    def __init__(
        self,
        id: Optional[int],
        organisation: int,
        email: str,
        fullname: str,
        password: Optional[str] = None
    ):
        self.id = id
        self.organisation = organisation
        self.email = email
        self.fullname = fullname
        self.password = password

    def __repr__(self) -> int:
        return f"<User {self.id}>"

    @property
    def serialize(self) -> UserDict:
        return {
            "id": self.id,
            "organisation": self.organisation,
            "email": self.email,
            "fullname": self.fullname,
            "active": True if self.password else False
        }


class UserBase(BaseModel):
    id: int
    organisation: int
    email: str
    fullname: str
    password: Optional[str] = None

    class Config:
        orm_mode = True
