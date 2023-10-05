import db.crud_project as crud_project

# from math import ceil
from fastapi import (
    APIRouter, Request, Depends,
    # HTTPException
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
# from typing import Optional

from db.connection import get_session
from models.project import (
    ProjectBase, ProjectDict
)
from middleware import verify_admin

security = HTTPBearer()
project_route = APIRouter()


@project_route.post(
    "/project",
    response_model=ProjectDict,
    summary="create project",
    name="project:create",
    tags=["Project"]
)
def create_tag(
    req: Request,
    payload: ProjectBase,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    user = verify_admin(session=session, authenticated=req.state.authenticated)
    project = crud_project.add_project(
        session=session, payload=payload, user=user)
    return project.serialize
