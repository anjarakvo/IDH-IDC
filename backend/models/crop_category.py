from db.connection import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel
from models.crop import Crop


class CropCategoryDict(TypedDict):
    id: int
    name: str


class CropCategoryWithChildDict(TypedDict):
    id: int
    name: str


class CropCategory(Base):
    __tablename__ = 'crop_category'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False, unique=True)

    crops = relationship(
        Crop,
        cascade="all, delete",
        passive_deletes=True,
        back_populates='crop_category_detail'
    )

    def __init__(self, name: str, id: Optional[int] = None):
        self.id = id
        self.name = name

    def __repr__(self) -> int:
        return f"<CropCategory {self.id}>"

    @property
    def serialize(self) -> CropCategoryDict:
        return {
            "id": self.id,
            "name": self.name,
        }

    @property
    def serialize_with_crops(self) -> CropCategoryWithChildDict:
        return {
            "id": self.id,
            "name": self.name,
            "crops": [c.simplify for c in self.crops]
        }


class CropCategoryBase(BaseModel):
    id: int
    name: str
