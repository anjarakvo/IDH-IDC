import db.crud_living_income_benchmark as crud_lib

from fastapi import (
    APIRouter, Request, Depends
)
from fastapi.security import (
    HTTPBearer
)
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.living_income_benchmark import LivingIncomeBenchmarkDict

security = HTTPBearer()
lib_route = APIRouter()


@lib_route.get(
    "/li_benchmark",
    response_model=List[LivingIncomeBenchmarkDict],
    summary="get all living income benchmark",
    name="lib:get_all",
    tags=["Living Income Benchmark"]
)
def get_all_lib(
    req: Request,
    session: Session = Depends(get_session),
):
    res = crud_lib.get_all_lib(session=session)
    return [r.serialize for r in res]
