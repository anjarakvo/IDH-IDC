from db.connection import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import BaseModel
from models.segment_answer import SegmentAnswerBase


class SegmentDict(TypedDict):
    id: int
    case: int
    name: str
    target: Optional[float]
    adult: Optional[float]
    child: Optional[float]


class SimplifiedSegmentDict(TypedDict):
    id: int
    name: str
    target: Optional[float]
    adult: Optional[float]
    child: Optional[float]


class SegmentWithAnswersDict(TypedDict):
    id: int
    case: int
    name: str
    target: Optional[float]
    adult: Optional[float]
    child: Optional[float]
    answers: Optional[dict]


class Segment(Base):
    __tablename__ = 'segment'

    id = Column(Integer, primary_key=True, nullable=False)
    case = Column(Integer, ForeignKey('case.id'))
    name = Column(String, nullable=False)
    target = Column(Float, nullable=True)
    adult = Column(Float, nullable=True)
    child = Column(Float, nullable=True)

    case_detail = relationship(
        'Case',
        cascade="all, delete",
        passive_deletes=True,
        back_populates='case_segments'
    )
    segment_answers = relationship(
        'SegmentAnswer',
        cascade="all, delete",
        passive_deletes=True,
        backref='segment_detail'
    )

    def __init__(
        self,
        name: str,
        case: int,
        target: Optional[float] = None,
        adult: Optional[float] = None,
        child: Optional[float] = None,
        id: Optional[int] = None,
    ):
        self.id = id
        self.case = case
        self.name = name
        self.target = target
        self.adult = adult
        self.child = child

    def __repr__(self) -> int:
        return f"<Segment {self.id}>"

    @property
    def serialize(self) -> SegmentDict:
        return {
            "id": self.id,
            "case": self.case,
            "name": self.name,
            "target": self.target,
            "adult": self.adult,
            "child": self.child,
        }

    @property
    def simplify(self) -> SimplifiedSegmentDict:
        return {
            "id": self.id,
            "name": self.name,
            "target": self.target,
            "adult": self.adult,
            "child": self.child,
        }

    @property
    def serialize_with_answers(self) -> SegmentWithAnswersDict:
        answers = {}
        for sa in self.segment_answers:
            case_commodity = sa.case_commodity
            current_key = f"current-{case_commodity}-{sa.question}"
            feasible_key = f"feasible-{case_commodity}-{sa.question}"
            answers[current_key] = sa.current_value
            answers[feasible_key] = sa.feasible_value
        return {
            "id": self.id,
            "case": self.case,
            "name": self.name,
            "target": self.target,
            "adult": self.adult,
            "child": self.child,
            "answers": answers
        }


class SegmentBase(BaseModel):
    name: str
    case: int
    target: Optional[float] = None
    adult: Optional[float] = None
    child: Optional[float] = None
    answers: Optional[List[SegmentAnswerBase]] = []


class SegmentUpdateBase(BaseModel):
    id: int
    name: str
    case: int
    target: Optional[float] = None
    adult: Optional[float] = None
    child: Optional[float] = None
    answers: Optional[List[SegmentAnswerBase]] = []
