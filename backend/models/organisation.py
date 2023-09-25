from db.connection import Base
from sqlalchemy import Column, Integer, String
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class OrganisationDict(TypedDict):
    id: int
    name: str


class Organisation(Base):
    __tablename__ = 'organisation'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)

    def __init__(self, id: Optional[int], name: str):
        self.id = id
        self.name = name

    def __repr__(self) -> int:
        return f"<Organisation {self.id}>"

    @property
    def serialize(self) -> OrganisationDict:
        return {
            "id": self.id,
            "name": self.name
        }


class OrganisationBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
