from db.connection import Base
from sqlalchemy import (
    Column, Integer, String, Date,
    Boolean, Enum, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class ProjectDict(TypedDict):
    id: Optional[int]
    folder: int
    name: str
    date: str
    year: int
    country: int
    crop: int
    currency: str
    area_size_unit: str
    volume_measurement_unit: str
    cost_of_production_unit: str
    reporting_period: str
    segmentation: str
    living_income_study: Optional[str]
    multiple_crops: bool
    logo: Optional[str]
    created_by: int


class Project(Base):
    __tablename__ = 'project'

    id = Column(Integer, primary_key=True, nullable=False)
    folder = Column(Integer, ForeignKey('folder.id'))
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    year = Column(Integer, nullable=False)
    country = Column(Integer, ForeignKey('country.id'))
    crop = Column(Integer, ForeignKey('crop.id'))
    currency = Column(String, nullable=False)
    area_size_unit = Column(String, nullable=False)
    volume_measurement_unit = Column(String, nullable=False)
    cost_of_production_unit = Column(String, nullable=False)
    reporting_period = Column(String, nullable=False)
    segmentation = Column(Boolean, nullable=False, default=False)
    living_income_study = Column(
        Enum(
            'better_income', 'living_income',
            name='project_living_income_study'
        ),
        nullable=True
    )
    multiple_crops = Column(Boolean, nullable=False, default=False)
    logo = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey('user.id'))
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    folder_detail = relationship(
        'Folder',
        cascade="all, delete",
        passive_deletes=True,
        backref='projects'
    )
    country_detail = relationship(
        'Country',
        cascade="all, delete",
        passive_deletes=True,
        backref='projects'
    )
    crop_detail = relationship(
        'Crop',
        cascade="all, delete",
        passive_deletes=True,
        backref='projects'
    )
    created_by_user = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        backref='projects'
    )

    def __init__(
        self,
        id: Optional[int],
        folder: int,
        name: str,
        date: str,
        year: int,
        country: int,
        crop: int,
        currency: str,
        area_size_unit: str,
        volume_measurement_unit: str,
        cost_of_production_unit: str,
        reporting_period: str,
        segmentation: str,
        living_income_study: Optional[str],
        multiple_crops: bool,
        logo: Optional[str],
        created_by: int
    ):
        self.id = id
        self.folder = folder
        self.name = name
        self.date = date
        self.year = year
        self.country = country
        self.crop = crop
        self.currency = currency
        self.area_size_unit = area_size_unit
        self.volume_measurement_unit = volume_measurement_unit
        self.cost_of_production_unit = cost_of_production_unit
        self.reporting_period = reporting_period
        self.segmentation = segmentation
        self.living_income_study = living_income_study
        self.multiple_crops = multiple_crops
        self.logo = logo
        self.created_by = created_by

    def __repr__(self) -> int:
        return f"<Project {self.id}>"

    @property
    def serialize(self) -> ProjectDict:
        return {
            "id": self.id,
            "folder": self.folder,
            "name": self.name,
            "date": self.date,
            "year": self.year,
            "country": self.country,
            "crop": self.crop,
            "currency": self.currency,
            "area_size_unit": self.area_size_unit,
            "volume_measurement_unit": self.volume_measurement_unit,
            "cost_of_production_unit": self.cost_of_production_unit,
            "reporting_period": self.reporting_period,
            "segmentation": self.segmentation,
            "living_income_study": self.living_income_study,
            "multiple_crops": self.multiple_crops,
            "logo": self.logo,
            "created_by": self.created_by,
        }


class ProjectBase(BaseModel):
    id: int
    folder: int
    name: str
    date: str
    year: int
    country: int
    crop: int
    currency: str
    area_size_unit: str
    volume_measurement_unit: str
    cost_of_production_unit: str
    reporting_period: str
    segmentation: str
    living_income_study: Optional[str] = None
    multiple_crops: bool
    logo: Optional[str] = None
    created_by: int

    class Config:
        orm_mode = True
