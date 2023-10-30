from typing import List, Optional
from sqlalchemy.orm import Session
# from fastapi import HTTPException, status
from models.cpi import Cpi, CpiDict


def get_cpi_by_country_year(
    session: Session, country: int, year: Optional[int]
) -> List[CpiDict]:
    cpi = session.query(Cpi).filter(Cpi.country == country)
    if year:
        cpi = cpi.filter(Cpi.year == year)
    return cpi.all()
