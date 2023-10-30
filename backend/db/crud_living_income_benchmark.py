from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from models.living_income_benchmark import (
    LivingIncomeBenchmark, LivingIncomeBenchmarkDict
)
from models.cpi import Cpi


def get_all_lib(session: Session) -> List[LivingIncomeBenchmarkDict]:
    return session.query(LivingIncomeBenchmark).all()


def get_by_country_region_year(
    session: Session, country: int, region: int, year: int
) -> LivingIncomeBenchmarkDict:
    lib = (
        session.query(LivingIncomeBenchmark)
        .filter(and_(
            LivingIncomeBenchmark.country == country,
            LivingIncomeBenchmark.region == region,
            LivingIncomeBenchmark.year == year,
        )).first()
    )
    if not lib:
        lib = (
            session.query(LivingIncomeBenchmark)
            .filter(and_(
                LivingIncomeBenchmark.country == country,
                LivingIncomeBenchmark.region == region,
            )).first()
        )
        if not lib:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benchmark not found"
            )
        cpi = session.query(Cpi).filter(and_(
            Cpi.country == country,
            Cpi.year == year,
        )).first()
        if cpi:
            lib = lib.serialize
            lib['year'] = year
            lib['cpi'] = cpi.value
            return lib
    else:
        lib = lib.serialize
        lib['cpi'] = None
        return lib
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Benchmark not found"
    )
