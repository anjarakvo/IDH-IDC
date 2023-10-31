from db.connection import Base
from sqlalchemy import Column, Integer, ForeignKey, Float
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CpiDict(TypedDict):
    id: int
    country: int
    year: int
    value: float


class Cpi(Base):
    __tablename__ = "cpi"

    id = Column(Integer, primary_key=True)
    country = Column(Integer, ForeignKey("country.id"), nullable=False)
    year = Column(Integer, nullable=False)
    value = Column(Float, nullable=False)

    def __init__(
        self,
        country: int,
        year: int,
        value: Optional[float] = None,
        id: Optional[int] = None,
    ):
        self.id = id
        self.country = country
        self.year = year
        self.value = value

    def __repr__(self) -> int:
        return f"<CPI {self.id}>"

    @property
    def serialize(self) -> CpiDict:
        return {
            "id": self.id,
            "country": self.country,
            "year": self.year,
            "value": self.value,
        }


class CpiBase(BaseModel):
    country: int
    year: int
    value: Optional[float] = None
    id: Optional[int] = None
