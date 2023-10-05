from sqlalchemy.orm import Session
from typing import Optional, List
from typing_extensions import TypedDict
# from fastapi import HTTPException, status

from models.user import User
from models.project import (
    Project, ProjectBase, ProjectDict, ProjectListDict
)
from models.project_crop import ProjectCrop
from models.project_tag import ProjectTag


class PaginatedProjectData(TypedDict):
    count: int
    data: List[ProjectListDict]


def add_project(
    session: Session, payload: ProjectBase, user: User
) -> ProjectDict:
    project = Project(
        name=payload.name,
        date=payload.date,
        year=payload.year,
        country=payload.country,
        focus_crop=payload.focus_crop,
        currency=payload.currency,
        area_size_unit=payload.area_size_unit,
        volume_measurement_unit=payload.volume_measurement_unit,
        cost_of_production_unit=payload.cost_of_production_unit,
        reporting_period=payload.reporting_period,
        segmentation=1 if payload.segmentation else 0,
        living_income_study=payload.living_income_study,
        multiple_crops=1 if payload.multiple_crops else 0,
        logo=payload.logo,
        created_by=user.id
    )
    # store to project_crop by default using focus_crop & breakdown true
    def_project_crop = ProjectCrop(crop=payload.focus_crop, breakdown=1)
    project.project_crops.append(def_project_crop)
    # store other crops
    if payload.other_crops:
        for val in payload.other_crops:
            project_crop = ProjectCrop(
                crop=val.crop,
                breakdown=1 if val.breakdown else 0
            )
            project.project_crops.append(project_crop)
    session.add(project)
    session.commit()
    session.flush()
    session.refresh(project)
    return project


def get_all_project(
    session: Session,
    search: Optional[str] = None,
    tags: Optional[int] = None,
    focus_crops: Optional[int] = None,
    skip: int = 0,
    limit: int = 10
) -> List[ProjectListDict]:
    project = session.query(Project)
    if search:
        project = project.filter(
            Project.name.ilike("%{}%".format(search.lower().strip()))
        )
    if focus_crops:
        project = project.filter(Project.focus_crop.in_(focus_crops))
    if tags:
        project_tags = session.query(ProjectTag).filter(
            ProjectTag.tag.in_(tags)).all()
        project_ids = [pt.project for pt in project_tags]
        project = project.filter(Project.id.in_(project_ids))
    count = project.count()
    project = project.order_by(
        Project.id.desc()).offset(skip).limit(limit).all()
    return PaginatedProjectData(count=count, data=project)
