from typing import Optional, List
from sqlalchemy.orm import Session
# from fastapi import HTTPException, status
from models.region import Region, RegionDict


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
