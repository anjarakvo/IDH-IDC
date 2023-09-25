from typing import Optional
from sqlalchemy.orm import Session
from models.user import User, UserDict


def add_user(
    session: Session,
    email: str,
    fullname: str,
    organisation: int,
    password: Optional[str] = None
) -> UserDict:
    user = User(
        email=email,
        fullname=fullname,
        organisation=organisation,
        password=password,
    )
    session.add(user)
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def get_user_by_email(session: Session, email: str) -> User:
    return session.query(User).filter(User.email == email).first()
