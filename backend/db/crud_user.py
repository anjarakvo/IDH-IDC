from fastapi import HTTPException, status
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from models.user import User, UserDict, UserBase
from typing import List


def add_user(
    session: Session,
    payload: UserBase,
) -> UserDict:
    try:
        password = payload.password.get_secret_value()
    except AttributeError:
        password = payload.password
    user = User(
        fullname=payload.fullname,
        email=payload.email,
        password=password,
        organisation=payload.organisation,
    )
    session.add(user)
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
