from db.connection import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class OrganisationDict(TypedDict):
    id: int
    name: str


class OrganisationOption(TypedDict):
    label: str
    value: int


class Organisation(Base):
    __tablename__ = 'organisation'

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)

    users = relationship(
        'User',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='user_organisation'
    )

    def __init__(self, id: Optional[int], name: str):
        self.id = id
        self.name = name

    def __repr__(self) -> int:
        return f"<Organisation {self.id}>"

    @property
    def serialize(self) -> OrganisationDict:
        return {
            "id": self.id,
            "name": self.name
        }

    @property
    def to_option(self) -> OrganisationOption:
        return {
            "label": self.name,
            "value": self.id,
        }


class OrganisationBase(BaseModel):
    id: int
    name: str
