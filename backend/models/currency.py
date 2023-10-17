from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CurrencyDict(TypedDict):
    id: int
    country: id
    name: str
    abbreviation: str


class Currency(Base):
    __tablename__ = "currency"

    id = Column(Integer, primary_key=True, nullable=False)
    country = Column(Integer, ForeignKey("country.id"), nullable=False)
    name = Column(String, nullable=False)
    abbreviation = Column(String, nullable=False)

    def __init__(self, id: Optional[int], country: int, name: str, abbreviation: str):
        self.id = id
        self.country = country
        self.name = name
        self.abbreviation = abbreviation

    def __repr__(self) -> int:
        return f"<Currency {self.id}>"

    @property
    def serialize(self) -> CurrencyDict:
        return {
            "id": self.id,
            "country": self.country,
            "name": self.name,
            "abbreviation": self.abbreviation,
        }


class CurrencyBase(BaseModel):
    id: int
    country: int
    name: str
    abbreviation: str
