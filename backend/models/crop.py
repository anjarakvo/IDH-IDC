from db.connection import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CropDict(TypedDict):
    id: int
    crop_category: int
    name: str


class Crop(Base):
    __tablename__ = 'crop'

    id = Column(Integer, primary_key=True)
    crop_category = Column(Integer, ForeignKey('crop_category.id'))
    name = Column(String, nullable=False, unique=True)

    crop_category_detail = relationship(
        'CropCategory',
        cascade="all, delete",
        passive_deletes=True,
        backref='crops'
    )

    def __init__(
        self,
        id: Optional[int],
        crop_category: int,
        name: str
    ):
        self.id = id
        self.crop_category = crop_category
        self.name = name

    def __repr__(self) -> int:
        return f"<Crop {self.id}>"

    @property
    def serialize(self) -> CropDict:
        return {
            "id": self.id,
            "crop_category": self.crop_category,
            "name": self.name,
        }


class CropBase(BaseModel):
    id: int
    crop_category: int
    name: str

    class Config:
        from_attributes = True
