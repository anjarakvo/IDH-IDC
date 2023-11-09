import db.crud_visualization as crud_visualization

from fastapi import APIRouter, Request, Depends
from fastapi.security import HTTPBearer, HTTPBasicCredentials as credentials
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.visualization import VisualizationBase, VisualizationDict

security = HTTPBearer()
visualization_route = APIRouter()


@visualization_route.post(
    "/visualization",
    response_model=VisualizationDict,
    summary="create or update visualization",
    name="visualization:create_or_update",
    tags=["Visualization"],
)
def create_visualization(
    req: Request,
    payload: VisualizationBase,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security),
):
    data = crud_visualization.create_or_update_visualization(
        session=session, payload=payload
    )
    return data.serialize


@visualization_route.get(
    "/visualization/{case_id:path}",
    response_model=List[VisualizationDict],
    summary="get visualization by case id",
    name="visualization:get_by_case_id",
    tags=["Visualization"],
)
def get_visualization_by_case_id(
    req: Request,
    case_id: int,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security),
):
    data = crud_visualization.get_by_case_id(session=session, case_id=case_id)
    return [d.serialize for d in data]
