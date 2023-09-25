from db.connection import Base
from sqlalchemy import Column, Integer, String
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class CropCategoryDict(TypedDict):
    id: int
    name: str


class CropCategory(Base):
    __tablename__ = 'crop_category'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False, unique=True)

    def __init__(self, id: Optional[int], name: str):
        self.id = id
        self.name = name

    def __repr__(self) -> int:
        return f"<CropCategory {self.id}>"

    @property
    def serialize(self) -> CropCategoryDict:
        return {
            "id": self.id,
            "name": self.name
        }


class CropCategoryBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
