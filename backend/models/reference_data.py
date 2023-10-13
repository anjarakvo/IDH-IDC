import enum
from db.connection import Base
from sqlalchemy import Column, Integer, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class ReferenceDataType(enum.Enum):
    baseline_average = "baseline_average"
    segment_average = "segment_average"


class ReferenceDataDict(TypedDict):
    id: int
    country: int
    commodity: int
    type: ReferenceDataType
    year: int
    farmer_production: Optional[float]
    farmgate_price: Optional[float]
    farmer_expenses: Optional[float]
    diversified_income: Optional[float]


class ReferenceData(Base):
    __tablename__ = "reference_data"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(Integer, ForeignKey("country.id"))
    commodity = Column(Integer, ForeignKey("commodity.id"))
    type = Column(Enum(ReferenceDataType), nullable=False)
    year = Column(Integer, nullable=True)
    farm_size = Column(
        Float, nullable=True, comment="The Farm Land Size in Hectare")
    farmer_production = Column(
        Float, nullable=True, comment="Farmer Production in KG")
    farmgate_price = Column(
        Float, nullable=True, comment="Farm Gate Price USD / KG")
    farmer_expenses = Column(
        Float, nullable=True, comment="Cost of Production in USD")
    diversified_income = Column(
        Float, nullable=True, comment="Secondary or Tertiary Income"
    )

    country_detail = relationship(
        'Country',
        cascade="all, delete",
        passive_deletes=True,
        backref='country_reference_data'
    )
    commodity_detail = relationship(
        'Commodity',
        cascade="all, delete",
        passive_deletes=True,
        backref='commodity_reference_data'
    )

    def __init__(
        self,
        id: Optional[int],
        country: int,
        commodity: int,
        type: ReferenceDataType,
        year: int,
        farmer_production: Optional[float],
        farmgate_price: Optional[float],
        farmer_expenses: Optional[float],
        diversified_income: Optional[float],
    ):
        self.id = id
        self.country = country
        self.commodity = commodity
        self.type = type
        self.year = year
        self.farmer_production = farmer_production
        self.farmgate_price = farmgate_price
        self.farmer_expenses = farmer_expenses
        self.diversified_income = diversified_income

    def __repr__(self) -> int:
        return f"<ReferenceData {self.id}>"

    @property
    def serializer(self) -> ReferenceDataDict:
        return {
            "id": self.id,
            "country": self.country,
            "commodity": self.commodity,
            "type": self.type,
            "year": self.year,
            "farmer_production": self.farmer_production,
            "farmgate_price": self.farmgate_price,
            "farmer_expenses": self.farmer_expenses,
            "diversified_income": self.diversified_income,
        }


class ReferenceDataBase(BaseModel):
    id: int
    country: int
    commodity: int
    type: ReferenceDataType
    year: int
    farmer_production: Optional[float] = None
    farmgate_price: Optional[float] = None
    farmer_expenses: Optional[float] = None
    diversified_income: Optional[float] = None

    class Config:
        from_attributes = True
