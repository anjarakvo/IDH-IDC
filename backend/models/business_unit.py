from db.connection import Base
from sqlalchemy import Column, Integer, String
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class BusinessUnitDict(TypedDict):
    id: int
    name: str


class BusinessUnit(Base):
    __tablename__ = 'business_unit'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False, unique=True)

    def __init__(self, name: str, id: Optional[int] = None):
        self.id = id
        self.name = name

    def __repr__(self) -> int:
        return f"<BusinessUnit {self.id}>"

    @property
    def serialize(self) -> BusinessUnitDict:
        return {
            "id": self.id,
            "name": self.name,
        }


class BusinessUnitBase(BaseModel):
    id: int
    name: str
