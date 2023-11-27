from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.user_case_access import (
    UserCaseAccess,
    UserCaseAccessPayload,
    UserCaseAccessDict,
)
from models.enum_type import PermissionType


def check_user_case_access_permission(
    session: Session, user_id: int, case_id: int, permission: PermissionType
) -> UserCaseAccess:
    res = (
        session.query(UserCaseAccess)
        .filter(
            and_(
                UserCaseAccess.user == user_id,
                UserCaseAccess.case == case_id,
                UserCaseAccess.permission == permission,
            )
        )
        .first()
    )
    return res


def find_user_case_access_viewer(
    session: Session, user_id: int
) -> List[UserCaseAccess]:
    # if user defined on this list, overide private case check
    # else user only can view public case (private = false)
    res = (
        session.query(UserCaseAccess)
        .filter(
            UserCaseAccess.user == user_id,
        )
        .all()
    )
    return res


def add_case_access(
    session: Session, payloads: List[UserCaseAccessPayload], case_id: int
) -> List[UserCaseAccessDict]:
    res = []
    # delete prev case access before add
    prev_access = (
        session.query(UserCaseAccess).filter(UserCaseAccess.case == case_id).all()
    )
    for pa in prev_access:
        session.delete(pa)
        session.commit()
    # add new case access
    for payload in payloads:
        uca = UserCaseAccess(
            case=case_id, user=payload.user, permission=payload.permission
        )
        session.add(uca)
        session.commit()
        session.flush()
        session.refresh(uca)
        res.append(uca)
    return res
