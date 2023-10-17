from db.connection import Base
from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class LivingIncomeBenchmarkDict(TypedDict):
    id: int
    country: int
    currency: int
    year: int
    value: float


class LivingIncomeBenchmark(Base):
    __tablename__ = 'living_income_benchmark'

    id = Column(Integer, primary_key=True, nullable=False)
    country = Column(Integer, ForeignKey('country.id'))
    currency = Column(Integer, ForeignKey('currency.id'))
    year = Column(Integer, nullable=False)
    value = Column(Float, nullable=False)

    country_detail = relationship(
        'Country',
        cascade="all, delete",
        passive_deletes=True,
        backref='country_living_income_benchmark'
    )
    currency_detail = relationship(
        'Currency',
        cascade="all, delete",
        passive_deletes=True,
        backref='currency_living_income_benchmark'
    )

    def __init__(
        self,
        id: Optional[int],
        country: int,
        currency: int,
        year: int,
        value: float,
    ):
        self.id = id
        self.country = country
        self.currency = currency
        self.year = year
        self.value = value

    def __repr__(self) -> int:
        return f"<LivingIncomeBenchmark {self.id}>"

    @property
    def serializer(self) -> LivingIncomeBenchmarkDict:
        return {
            "id": self.id,
            "country": self.country,
            "currency": self.currency,
            "year": self.year,
            "value": self.value,
        }


class LivingIncomeBenchmarkBase(BaseModel):
    id: int
    country: int
    currency: int
    year: int
    value: float
