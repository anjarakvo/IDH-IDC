from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional, List
from typing_extensions import TypedDict
from fastapi import HTTPException, status

from models.user import User
from models.case import Case, CaseBase, CaseDict, CaseListDict
from models.case_commodity import CaseCommodity
from models.case_tag import CaseTag


class PaginatedCaseData(TypedDict):
    count: int
    data: List[CaseListDict]


def add_case(session: Session, payload: CaseBase, user: User) -> CaseDict:
    case = Case(
        name=payload.name,
        date=payload.date,
        year=payload.year,
        country=payload.country,
        focus_commodity=payload.focus_commodity,
        currency=payload.currency,
        area_size_unit=payload.area_size_unit,
        volume_measurement_unit=payload.volume_measurement_unit,
        cost_of_production_unit=payload.cost_of_production_unit,
        reporting_period=payload.reporting_period,
        segmentation=1 if payload.segmentation else 0,
        living_income_study=payload.living_income_study,
        multiple_commodities=1 if payload.multiple_commodities else 0,
        logo=payload.logo,
        private=1 if payload.private else 0,
        created_by=user.id,
    )
    # store to case_commodity by default using focus_commodity & breakdown true
    def_case_commodity = CaseCommodity(
        commodity=payload.focus_commodity,
        breakdown=1,
        area_size_unit=payload.area_size_unit,
        volume_measurement_unit=payload.volume_measurement_unit,
    )
    case.case_commodities.append(def_case_commodity)
    # store other commodities
    if payload.other_commodities:
        for val in payload.other_commodities:
            case_commodity = CaseCommodity(
                commodity=val.commodity,
                breakdown=1 if val.breakdown else 0,
                area_size_unit=val.area_size_unit,
                volume_measurement_unit=val.volume_measurement_unit,
            )
            case.case_commodities.append(case_commodity)
    session.add(case)
    session.commit()
    session.flush()
    session.refresh(case)
    return case


def get_all_case(
    session: Session,
    show_private: Optional[bool] = 0,
    search: Optional[str] = None,
    tags: Optional[int] = None,
    focus_commodities: Optional[int] = None,
    skip: int = 0,
    limit: int = 10,
) -> List[CaseListDict]:
    case = session.query(Case)
    if not show_private:
        case = case.filter(Case.private == 0)
    if search:
        case = case.filter(Case.name.ilike("%{}%".format(search.lower().strip())))
    if focus_commodities:
        case = case.filter(Case.focus_commodity.in_(focus_commodities))
    if tags:
        case_tags = session.query(CaseTag).filter(CaseTag.tag.in_(tags)).all()
        case_ids = [pt.case for pt in case_tags]
        case = case.filter(Case.id.in_(case_ids))
    count = case.count()
    case = case.order_by(Case.id.desc()).offset(skip).limit(limit).all()
    return PaginatedCaseData(count=count, data=case)


def get_case_by_id(session: Session, id: int) -> CaseDict:
    case = session.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Case {id} not found"
        )
    return case


def update_case(session: Session, id: int, payload: CaseBase) -> CaseDict:
    case = get_case_by_id(session=session, id=id)
    case.name = payload.name
    case.date = payload.date
    case.year = payload.year
    case.country = payload.country
    case.focus_commodity = payload.focus_commodity
    case.currency = payload.currency
    case.area_size_unit = payload.area_size_unit
    case.volume_measurement_unit = payload.volume_measurement_unit
    case.cost_of_production_unit = payload.cost_of_production_unit
    case.reporting_period = payload.reporting_period
    case.segmentation = 1 if payload.segmentation else 0
    case.living_income_study = payload.living_income_study
    case.multiple_commodities = 1 if payload.multiple_commodities else 0
    case.logo = payload.logo
    case.private = 1 if payload.private else 0
    # store other commodities
    # TODO ::
    """
    What if we remove the other_commodities from case
    which has existing question value?
    """
    if payload.other_commodities:
        for val in payload.other_commodities:
            breakdown = 1 if val.breakdown else 0
            prev_case_commodity = (
                session.query(CaseCommodity)
                .filter(
                    and_(
                        CaseCommodity.case == case.id,
                        CaseCommodity.commodity == val.commodity,
                    )
                )
                .first()
            )
            if prev_case_commodity:
                # update breakdown value
                prev_case_commodity.breakdown = breakdown
                session.commit()
                session.flush()
                session.refresh(prev_case_commodity)
            else:
                case_commodity = CaseCommodity(
                    commodity=val.commodity,
                    breakdown=breakdown,
                    area_size_unit=val.area_size_unit,
                    volume_measurement_unit=val.volume_measurement_unit,
                )
                case.case_commodities.append(case_commodity)
    session.commit()
    session.flush()
    session.refresh(case)
    return case
