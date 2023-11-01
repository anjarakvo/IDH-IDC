import db.crud_region as crud_region

from fastapi import (
    APIRouter, Request, Depends
)
from fastapi.security import (
    HTTPBearer
)
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.region import RegionDropdown

security = HTTPBearer()
region_route = APIRouter()


@region_route.get(
    "/region/options",
    response_model=List[RegionDropdown],
    summary="get region by country as options dropdown",
    name="region:get_options_by_country",
    tags=["Region"]
)
def get_region_options(
    req: Request,
    country_id: int,
    session: Session = Depends(get_session),
):
    regions = crud_region.get_region_by_country(
        session=session, country=country_id)
    return [rg.to_dropdown for rg in regions]
