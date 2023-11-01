import db.crud_cpi as crud_cpi

from fastapi import (
    APIRouter, Request, Depends
)
from fastapi.security import (
    HTTPBearer
)
from sqlalchemy.orm import Session
from typing import List, Optional

from db.connection import get_session
from models.cpi import CpiDict

security = HTTPBearer()
cpi_route = APIRouter()


@cpi_route.get(
    "/cpi",
    response_model=List[CpiDict],
    summary="get cpi by country and year",
    name="cpi:get_by_country_and_year",
    tags=["CPI"]
)
def get_cpi_by_country_year(
    req: Request,
    country: int,
    year: Optional[int] = None,
    session: Session = Depends(get_session),
):
    res = crud_cpi.get_cpi_by_country_year(
        session=session, country=country, year=year
    )
    return [r.serialize for r in res]
