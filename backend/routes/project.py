import db.crud_project as crud_project

from math import ceil
from fastapi import (
    APIRouter, Request, Depends, HTTPException
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
from typing import Optional, List
from db.connection import get_session
from models.project import (
    ProjectBase, ProjectDict, PaginatedProjectResponse
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
def create_project(
    req: Request,
    payload: ProjectBase,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    user = verify_admin(session=session, authenticated=req.state.authenticated)
    project = crud_project.add_project(
        session=session, payload=payload, user=user)
    return project.serialize


@project_route.get(
    "/project",
    response_model=PaginatedProjectResponse,
    summary="get all project",
    name="project:get_all",
    tags=["Project"]
)
def get_all_project(
    req: Request,
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    tags: Optional[List[int]] = None,
    focus_crop: Optional[List[int]] = None,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    projects = crud_project.get_all_project(
        session=session, search=search,
        tags=tags, focus_crops=focus_crop,
        skip=(limit * (page - 1)), limit=limit
    )
    if not projects:
        raise HTTPException(status_code=404, detail="Not found")
    total = projects["count"]
    projects = [project.to_project_list for project in projects["data"]]
    total_page = ceil(total / limit) if total > 0 else 0
    if total_page < page:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        'current': page,
        'data': projects,
        'total': total,
        'total_page': total_page
    }


@project_route.put(
    "/project/{project_id:path}",
    response_model=ProjectDict,
    summary="update project by id",
    name="project:update",
    tags=["Project"]
)
def update_Project(
    req: Request,
    project_id: int,
    payload: ProjectBase,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_admin(session=session, authenticated=req.state.authenticated)
    project = crud_project.update_project(
        session=session, id=project_id, payload=payload)
    return project.serialize
