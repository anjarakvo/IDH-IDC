from db.connection import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CropDict(TypedDict):
    id: int
    crop_category: int
    name: str
    focus_crop: bool


class Crop(Base):
    __tablename__ = 'crop'

    id = Column(Integer, primary_key=True)
    crop_category = Column(Integer, ForeignKey('crop_category.id'))
    name = Column(String, nullable=False, unique=True)
    focus_crop = Column(Boolean, default=True, nullable=False)

    crop_category_detail = relationship(
        'CropCategory',
        cascade="all, delete",
        passive_deletes=True,
        backref='crops'
    )

    def __init__(
        self,
        crop_category: int,
        name: str,
        id: Optional[int] = None,
        focus_crop: Optional[bool] = True
    ):
        self.id = id
        self.crop_category = crop_category
        self.name = name
        self.focus_crop = focus_crop

    def __repr__(self) -> int:
        return f"<Crop {self.id}>"

    @property
    def serialize(self) -> CropDict:
        return {
            "id": self.id,
            "crop_category": self.crop_category,
            "name": self.name,
            "focus_crop": self.focus_crop,
        }


class CropBase(BaseModel):
    id: int
    crop_category: int
    name: str
    focus_crop: Optional[bool] = True

    class Config:
        from_attributes = True
