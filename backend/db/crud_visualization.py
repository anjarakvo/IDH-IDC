from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from typing_extensions import TypedDict
from fastapi import HTTPException, status

from models.visualization import Visualization, VisualizationBase, VisualizationDict


def create_or_update_visualization(
    session: Session, payload: VisualizationBase
) -> VisualizationDict:
    prev_data = (
        session.query(Visualization)
        .filter(
            and_(
                Visualization.case == payload.case,
                Visualization.segment == payload.segment,
                Visualization.tab == payload.tab,
            )
        )
        .first()
    )
    if prev_data:
        # update
        prev_data.config = payload.config
        session.commit()
        session.flush()
        session.refresh(prev_data)
        return prev_data
    # add
    data = Visualization(
        case=payload.case,
        segment=payload.segment,
        tab=payload.tab,
        config=payload.config,
    )
    session.add(data)
    session.commit()
    session.flush()
    session.refresh(data)
    return data


def get_by_case_id(session: Session, case_id: int) -> List[VisualizationDict]:
    return session.query(Visualization).filter(Visualization.case == case_id).all()
