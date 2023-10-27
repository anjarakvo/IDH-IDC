from db.connection import Base
from sqlalchemy import Column, Integer, Float, ForeignKey, String
# from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class LivingIncomeBenchmarkDict(TypedDict):
    id: int
    country: int
    region: int
    household_size: float
    year: int
    source: Optional[str]
    lcu: float
    usd: float
    eur: float


class LivingIncomeBenchmark(Base):
    __tablename__ = 'living_income_benchmark'

    id = Column(Integer, primary_key=True, nullable=False)
    country = Column(Integer, ForeignKey('country.id'))
    region = Column(Integer, ForeignKey('region.id'))
    household_size = Column(Float, nullable=False)
    year = Column(Integer, nullable=False)
    source = Column(String, nullable=True)
    lcu = Column(Float, nullable=False)
    usd = Column(Float, nullable=False)
    eur = Column(Float, nullable=False)

    # country_detail = relationship(
    #     'Country',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='country_living_income_benchmark'
    # )
    # region_detail = relationship(
    #     'region',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='region_living_income_benchmark'
    # )

    def __init__(
        self,
        country: int,
        region: int,
        year: int,
        household_size: float,
        lcu: float,
        usd: float,
        eur: float,
        id: Optional[int] = None,
        source: Optional[str] = None,
    ):
        self.id = id
        self.country = country
        self.region = region
        self.year = year
        self.household_size = household_size
        self.source = source
        self.lcu = lcu
        self.usd = usd
        self.eur = eur

    def __repr__(self) -> int:
        return f"<LivingIncomeBenchmark {self.id}>"

    @property
    def serialize(self) -> LivingIncomeBenchmarkDict:
        return {
            "id": self.id,
            "country": self.country,
            "region": self.region,
            "year": self.year,
            "household_size": self.household_size,
            "source": self.source,
            "lcu": self.lcu,
            "usd": self.usd,
            "eur": self.eur,
        }


class LivingIncomeBenchmarkBase(BaseModel):
    id: int
    country: int
    region: int
    year: int
    household_size: float
    lcu: float
    usd: float
    eur: float
    source: Optional[str]
