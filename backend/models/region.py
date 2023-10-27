from db.connection import Base
from sqlalchemy import Column, Integer, String, ARRAY
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import BaseModel


class RegionDict(TypedDict):
    id: int
    name: str
    country_ids: List[int]


class RegionDropdown(TypedDict):
    value: int
    label: str


class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    country_ids = Column(ARRAY(Integer), nullable=False)

    def __init__(
        self,
        name: str,
        id: Optional[int] = None,
        country_ids: Optional[List[int]] = None,
    ):
        self.id = id
        self.name = name
        self.country_ids = country_ids

    def __repr__(self) -> int:
        return f"<Region {self.id}>"

    @property
    def serialize(self) -> RegionDict:
        return {
            "id": self.id,
            "name": self.name,
            "country_ids": self.country_ids,
        }

    @property
    def to_dropdown(self) -> RegionDropdown:
        return {
            "value": self.id,
            "label": self.name,
        }


class RegionBase(BaseModel):
    name: str
    id: Optional[int] = None
    country_ids: Optional[List[int]] = None
