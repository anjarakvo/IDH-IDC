from typing import List
from sqlalchemy.orm import Session
# from fastapi import HTTPException, status
from models.living_income_benchmark import (
    LivingIncomeBenchmark, LivingIncomeBenchmarkDict
)


def get_all_lib(session: Session) -> List[LivingIncomeBenchmarkDict]:
    return session.query(LivingIncomeBenchmark).all()
