from uuid import uuid4
from fastapi import HTTPException, status
from typing import Optional, List
from sqlalchemy import or_
from sqlalchemy.orm import Session
from models.user import (
    User, UserDict, UserBase, UserUpdateBase, UserInvitation,
    UserRole
)
from models.user_case_access import UserCaseAccess
from models.user_tag import UserTag


def add_user(
    session: Session,
    payload: UserBase,
    invitation_id: Optional[bool] = False,
) -> UserDict:
    try:
        password = payload.password.get_secret_value()
    except AttributeError:
        password = payload.password
    role = (
        payload.role
        if invitation_id or payload.role
        else UserRole.user
    )
    user = User(
        fullname=payload.fullname,
        email=payload.email,
        password=password if not invitation_id else None,
        organisation=payload.organisation,
        role=role,
        invitation_id=str(uuid4()) if invitation_id else None
    )
    if payload.cases:
        for proj in payload.cases:
            case_access = UserCaseAccess(case=proj)
            user.user_case_access.append(case_access)
    if payload.tags:
        for tag in payload.tags:
            user_tag = UserTag(tag=tag)
            user.user_tags.append(user_tag)
    session.add(user)
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def update_user(
    session: Session, id: int, payload: UserUpdateBase
) -> UserDict:
    user = get_user_by_id(session=session, id=id)
    user.fullname = payload.fullname
    user.organisation = payload.organisation
    user.is_active = 1 if payload.is_active else 0
    user.role = payload.role if payload.role else user.role
    user.all_cases = 1 if payload.all_cases else 0
    if payload.password:
        try:
            password = payload.password.get_secret_value()
        except AttributeError:
            password = payload.password
        user.password = password
    if payload.cases:
        for proj in payload.cases:
            case_access = UserCaseAccess(
                user=user.id, case=proj)
            user.user_case_access.append(case_access)
    if payload.tags:
        for tag in payload.tags:
            user_tag = UserTag(user=user.id, tag=tag)
            user.user_tags.append(user_tag)
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def update_password(session: Session, id: int, password: str) -> UserDict:
    user = get_user_by_id(session=session, id=id)
    user.password = password
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def get_user_by_email(session: Session, email: str) -> User:
    return session.query(User).filter(User.email == email).first()


def get_user_by_id(session: Session, id: int) -> UserDict:
    user = session.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"user {id} not found"
        )
    return user


def filter_user(
    session: Session,
    search: Optional[str] = None,
    organisation: Optional[int] = None
):
    user = session.query(User)
    if search:
        user = user.filter(
            or_(
                User.name.ilike("%{}%".format(search.lower().strip())),
                User.email.ilike("%{}%".format(search.lower().strip())),
            ))
    if organisation:
        user = user.filter(User.organisation.in_(organisation))
    return user


def get_all_user(
    session: Session,
    search: Optional[str] = None,
    organisation: Optional[List[int]] = None,
    skip: int = 0,
    limit: int = 10
) -> List[UserDict]:
    user = filter_user(
        session=session, search=search, organisation=organisation)
    user = user.order_by(User.id.desc()).offset(skip).limit(limit).all()
    return user


def count(
    session: Session,
    search: Optional[str] = None,
    organisation: Optional[int] = None
) -> int:
    user = filter_user(
        session=session, search=search, organisation=organisation)
    return user.count()


def delete_user(session: Session, id: int):
    user = get_user_by_id(session=session, id=id)
    session.delete(user)
    session.commit()
    session.flush()


def get_invitation(session: Session, invitation_id: str) -> UserInvitation:
    user = session.query(User).filter(
        User.invitation_id == invitation_id).first()
    if not user:
        return None
    return user


def accept_invitation(
    session: Session,
    invitation_id: str,
    password=str
) -> UserInvitation:
    user = get_invitation(session=session, invitation_id=invitation_id)
    user.password = password
    user.invitation = None
    user.is_active = 1
    session.commit()
    session.flush()
    session.refresh(user)
    return user
