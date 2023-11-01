from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.region import Region, RegionDict
from models.country_region import CountryRegion


def get_all_region(session: Session) -> List[RegionDict]:
    return session.query(Region).all()


def get_region_by_country(session: Session, country: int) -> List[RegionDict]:
    country_region = (
        session.query(CountryRegion)
        .filter(CountryRegion.country == country)
        .all()
    )
    if not country_region:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Regions for country {country} not found"
        )
    region_ids = [cr.region for cr in country_region]
    return session.query(Region).filter(Region.id.in_(region_ids)).all()
