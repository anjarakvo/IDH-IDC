from typing import Optional, List
from sqlalchemy.orm import Session
# from fastapi import HTTPException, status
from models.region import Region, RegionDict
from models.country_region import CountryRegion


def add_region(
    session: Session,
    name: str,
    country_ids: List[int],
    id: Optional[int] = None,
) -> RegionDict:
    region = Region(id=id, name=name, country_ids=country_ids)
    session.add(region)
    session.commit()
    session.flush()
    session.refresh(region)
    return region


def get_all_region(session: Session) -> List[RegionDict]:
    return session.query(Region).all()


def get_region_by_country(session: Session, country: int) -> List[RegionDict]:
    country_region = (
        session.query(CountryRegion)
        .filter(CountryRegion.country == country)
        .all()
    )
    region_ids = [cr.region for cr in country_region]
    return session.query(Region).filter(Region.id.in_(region_ids)).all()
