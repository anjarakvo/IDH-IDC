from db.connection import Base
from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from typing import Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class SegmentAnswerDict(TypedDict):
    id: int
    project_commodity: int
    segment: int
    question: int
    current_value: float
    feasible_value: Optional[float]


class SegmentAnswer(Base):
    __tablename__ = 'segment_answer'

    id = Column(Integer, primary_key=True, nullable=False)
    project_commodity = Column(Integer, ForeignKey('project_commodity.id'))
    segment = Column(Integer, ForeignKey('segment.id'))
    question = Column(Integer, ForeignKey('question.id'))
    current_value = Column(Float, nullable=False)
    feasible_value = Column(Float, nullable=True)

    project_commodity_detail = relationship(
        'ProjectCommodity',
        cascade="all, delete",
        passive_deletes=True,
        backref='project_commodity_segment_answer'
    )
    segment_detail = relationship(
        'Segment',
        cascade="all, delete",
        passive_deletes=True,
        backref='segment_answer'
    )
    question_detail = relationship(
        'Question',
        cascade="all, delete",
        passive_deletes=True,
        backref='question_segment_answer'
    )

    def __init__(
        self,
        project_commodity: int,
        segment: int,
        question: int,
        current_value: float,
        feasible_value: Optional[float] = None,
        id: Optional[int] = None,
    ):
        self.id = id
        self.project_commodity = project_commodity
        self.segment = segment
        self.question = question
        self.current_value = current_value
        self.feasible_value = feasible_value

    def __repr__(self) -> int:
        return f"<SegmentAnswer {self.id}>"

    @property
    def serialize(self) -> SegmentAnswerDict:
        return {
            "id": self.id,
            "project_commodity": self.project_commodity,
            "segment": self.segment,
            "question": self.question,
            "current_value": self.current_value,
            "feasible_value": self.feasible_value,
        }


class SegmentAnswerBase(BaseModel):
    project_commodity: int
    segment: int
    question: int
    current_value: float
    feasible_value: Optional[float] = None
