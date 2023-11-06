from db.connection import Base
from sqlalchemy import Column, ForeignKey, Integer
from typing import Optional
from pydantic import BaseModel
from models.country import Country


class CountryRegion(Base):
    __tablename__ = "country_region"

    id = Column(Integer, primary_key=True, nullable=False)
    country = Column(Integer, ForeignKey(Country.id), nullable=False)
    region = Column(Integer, ForeignKey("region.id"), nullable=False)

    def __init__(
        self,
        country: int,
        region: int,
        id: Optional[int] = None,
    ):
        self.id = id
        self.country = country
        self.region = region

    def __repr__(self) -> int:
        return f"<CountryRegion {self.id}>"


class CountryRegionBase(BaseModel):
    id: int
    country: int
    region: int
