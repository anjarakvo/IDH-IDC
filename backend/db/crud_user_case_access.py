from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.user_case_access import UserCaseAccess
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
