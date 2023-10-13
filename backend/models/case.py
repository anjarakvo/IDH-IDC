import enum
from datetime import date as date_format
from db.connection import Base
from sqlalchemy import (
    Column, Integer, String, Date,
    SmallInteger, Enum, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import BaseModel
from models.case_commodity import CaseCommodity, SimplifiedCaseCommodityDict
from models.segment import Segment, SimplifiedSegmentDict


class LivingIncomeStudyEnum(enum.Enum):
    better_income = "better_income"
    living_income = "living_income"


class CaseListDict(TypedDict):
    id: int
    name: str
    country: int
    focus_commodity: int
    diversified_commodities_count: int
    created_at: str
    created_by: str


class CaseDict(TypedDict):
    id: Optional[int]
    name: str
    date: str
    year: int
    country: int
    focus_commodity: int
    currency: str
    area_size_unit: str
    volume_measurement_unit: str
    cost_of_production_unit: str
    reporting_period: str
    segmentation: bool
    living_income_study: Optional[LivingIncomeStudyEnum]
    multiple_commodities: bool
    logo: Optional[str]
    created_by: int
    case_commodities: List[SimplifiedCaseCommodityDict]


class CaseDetailDict(TypedDict):
    id: int
    name: str
    date: str
    year: int
    country: int
    focus_commodity: int
    currency: str
    area_size_unit: str
    volume_measurement_unit: str
    cost_of_production_unit: str
    reporting_period: str
    segmentation: bool
    living_income_study: Optional[LivingIncomeStudyEnum]
    multiple_commodities: bool
    created_by: str
    created_at: str
    updated_at: Optional[str]
    segments: Optional[List[SimplifiedSegmentDict]]
    case_commodities: List[SimplifiedCaseCommodityDict]


class Case(Base):
    __tablename__ = 'case'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    year = Column(Integer, nullable=False)
    country = Column(Integer, ForeignKey('country.id'))
    focus_commodity = Column(Integer, ForeignKey('commodity.id'))
    currency = Column(String, nullable=False)
    area_size_unit = Column(String, nullable=False)
    volume_measurement_unit = Column(String, nullable=False)
    cost_of_production_unit = Column(String, nullable=False)
    reporting_period = Column(String, nullable=False)
    segmentation = Column(SmallInteger, nullable=False, default=0)
    living_income_study = Column(Enum(LivingIncomeStudyEnum), nullable=True)
    multiple_commodities = Column(SmallInteger, nullable=False, default=0)
    private = Column(SmallInteger, nullable=False, default=0)
    logo = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey('user.id'))
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    case_commodities = relationship(
        CaseCommodity,
        cascade="all, delete",
        passive_deletes=True,
        back_populates='case_detail'
    )
    case_segments = relationship(
        Segment,
        cascade="all, delete",
        passive_deletes=True,
        back_populates='case_detail'
    )
    # country_detail = relationship(
    #     'Country',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='cases'
    # )
    # commodity_detail = relationship(
    #     'Commodity',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     backref='cases'
    # )
    created_by_user = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='cases'
    )

    def __init__(
        self,
        name: str,
        date: str,
        year: int,
        country: int,
        focus_commodity: int,
        currency: str,
        area_size_unit: str,
        volume_measurement_unit: str,
        cost_of_production_unit: str,
        reporting_period: str,
        segmentation: int,
        living_income_study: Optional[str],
        multiple_commodities: int,
        logo: Optional[str],
        created_by: int,
        private: Optional[int] = 0,
        id: Optional[int] = None,
    ):
        self.id = id
        self.name = name
        self.date = date
        self.year = year
        self.country = country
        self.focus_commodity = focus_commodity
        self.currency = currency
        self.area_size_unit = area_size_unit
        self.volume_measurement_unit = volume_measurement_unit
        self.cost_of_production_unit = cost_of_production_unit
        self.reporting_period = reporting_period
        self.segmentation = segmentation
        self.living_income_study = living_income_study
        self.multiple_commodities = multiple_commodities
        self.logo = logo
        self.private = private
        self.created_by = created_by

    def __repr__(self) -> int:
        return f"<Case {self.id}>"

    @property
    def serialize(self) -> CaseDict:
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date.strftime('%Y-%m-%d'),
            "year": self.year,
            "country": self.country,
            "focus_commodity": self.focus_commodity,
            "currency": self.currency,
            "area_size_unit": self.area_size_unit,
            "volume_measurement_unit": self.volume_measurement_unit,
            "cost_of_production_unit": self.cost_of_production_unit,
            "reporting_period": self.reporting_period,
            "segmentation": self.segmentation,
            "living_income_study": self.living_income_study,
            "multiple_commodities": self.multiple_commodities,
            "logo": self.logo,
            "created_by": self.created_by,
            "case_commodities": [pc.simplify for pc in self.case_commodities],
        }

    @property
    def to_case_list(self) -> CaseListDict:
        # filter diversified count by !equal to focus commodity
        diversified_count = [
            val for val in self.case_commodities
            if val.commodity != self.focus_commodity
        ]
        return {
            "id": self.id,
            "name": self.name,
            "country": self.country,
            "focus_commodity": self.focus_commodity,
            "diversified_commodities_count": len(diversified_count),
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "created_by": self.created_by_user.email,
        }

    @property
    def to_case_detail(self) -> CaseDetailDict:
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date.strftime('%Y-%m-%d'),
            "year": self.year,
            "country": self.country,
            "focus_commodity": self.focus_commodity,
            "currency": self.currency,
            "area_size_unit": self.area_size_unit,
            "volume_measurement_unit": self.volume_measurement_unit,
            "cost_of_production_unit": self.cost_of_production_unit,
            "reporting_period": self.reporting_period,
            "segmentation": self.segmentation,
            "living_income_study": self.living_income_study,
            "multiple_commodities": self.multiple_commodities,
            "logo": self.logo,
            "created_by": self.created_by_user.email,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            "segments": [ps.simplify for ps in self.case_segments],
            "case_commodities": [pc.simplify for pc in self.case_commodities],
        }


class OtherCommoditysBase(BaseModel):
    commodity: int
    breakdown: bool


class CaseBase(BaseModel):
    name: str
    date: date_format
    year: int
    country: int
    focus_commodity: int
    currency: str
    area_size_unit: str
    volume_measurement_unit: str
    cost_of_production_unit: str
    reporting_period: str
    segmentation: bool
    multiple_commodities: bool
    living_income_study: Optional[LivingIncomeStudyEnum] = None
    logo: Optional[str] = None
    private: Optional[bool] = False
    other_commodities: Optional[List[OtherCommoditysBase]] = None


class PaginatedCaseResponse(BaseModel):
    current: int
    data: List[CaseListDict]
    total: int
    total_page: int
