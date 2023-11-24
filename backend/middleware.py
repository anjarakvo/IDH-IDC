import os

from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt, exceptions
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from models.user import UserInfo, UserRole
from db import crud_user
from db.crud_user_business_unit import find_user_business_units

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.environ.get("SECRET_KEY", None)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1
ACCESS_TOKEN_EXPIRE_DAYS = 1

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo


class TokenData(BaseModel):
    email: Optional[str] = None


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(session: Session, email: str, password: str):
    user = crud_user.get_user_by_email(session=session, email=email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    data.update({"exp": expire})
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str = Depends(oauth2_scheme)):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except exceptions.ExpiredSignatureError:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )


def verify_token(authenticated):
    if authenticated and datetime.now().timestamp() > authenticated.get("exp"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    return authenticated


def verify_user(session: Session, authenticated):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    authenticated = verify_token(authenticated)
    try:
        email: str = authenticated.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud_user.get_user_by_email(session=session, email=token_data.email)
    if not user:
        raise credentials_exception
    return user


def verify_super_admin(session: Session, authenticated):
    user = verify_user(session=session, authenticated=authenticated)
    if user.role != UserRole.super_admin:
        raise HTTPException(status_code=403, detail="You don't have data access")
    return user


def verify_admin(session: Session, authenticated):
    user = verify_user(session=session, authenticated=authenticated)
    if user.role == UserRole.super_admin:
        return user
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="You don't have data access")
    return user


def verify_user_management(session: Session, authenticated):
    roles = [UserRole.super_admin, UserRole.admin]
    user = verify_user(session=session, authenticated=authenticated)
    if user.role not in roles:
        raise HTTPException(status_code=403, detail="You don't have data access")
    return user


def verify_case_creator(session: Session, authenticated):
    roles = [UserRole.super_admin, UserRole.admin, UserRole.user]
    user = verify_user(session=session, authenticated=authenticated)
    if user.role not in roles:
        raise HTTPException(status_code=403, detail="You don't have data access")
    # overide case creator for UserRole.user
    # case creator only for Regular/Internal User (user with BU)
    user_bu = find_user_business_units(session=session, user_id=user.id)
    if user.role == UserRole.user and not user_bu:
        # if External user (user without BU), restrict case creator access
        raise HTTPException(
            status_code=403, detail="You don't have access to create a case"
        )
    return user
