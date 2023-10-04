import os
from math import ceil
from middleware import (
    Token, authenticate_user, create_access_token, verify_user,
    get_password_hash

)
from fastapi import Depends, HTTPException, status, APIRouter, Request, Query
from fastapi import Response
from fastapi.security import HTTPBearer
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db.connection import get_session
from models.user import UserDict, UserBase, UserResponse, UserWithOrg
from db import crud_user
from typing import Optional
from http import HTTPStatus

security = HTTPBearer()
user_route = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")
oauth2_scopes = ["openid", "email"]


@user_route.post(
    "/user/login",
    response_model=Token,
    summary="user login",
    name="user:login",
    tags=["User"]
)
def login(
    req: Request,
    payload: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    if not payload.grant_type == "password":
        raise HTTPException(status_code=404, detail="Invalid Grant Type")
    if payload.client_id != os.environ["CLIENT_ID"]:
        raise HTTPException(status_code=404, detail="Invalid Client ID")
    if payload.client_secret != os.environ["CLIENT_SECRET"]:
        raise HTTPException(status_code=404, detail="Invalid Client Secret")
    for scope in payload.scopes:
        if scope not in oauth2_scopes:
            raise HTTPException(status_code=404, detail="Scope Not Found")
    user = authenticate_user(
        session=session, email=payload.username, password=payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_user_with_org
    }


@user_route.get(
    "/user",
    response_model=UserResponse,
    summary="get all users",
    name="user:get_all",
    tags=["User"]
)
def get_all(
    req: Request,
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    organisation: Optional[int] = Query(None),
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    user = crud_user.get_all_user(
        session=session,
        search=search,
        organisation=organisation,
        skip=(limit * (page - 1)),
        limit=limit
    )
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    # count total user
    total = crud_user.count(
        session=session, search=search, organisation=organisation)
    user = [u.to_user_list for u in user]
    total_page = ceil(total / limit) if total > 0 else 0
    if total_page < page:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        'current': page,
        'data': user,
        'total': total,
        'total_page': total_page
    }


@user_route.get(
    "/user/me",
    response_model=UserWithOrg,
    summary="get account information",
    name="user:me",
    tags=["User"]
)
def get_me(
    req: Request,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    user = verify_user(session=session, authenticated=req.state.authenticated)
    return user.to_user_with_org


@user_route.post(
    "/user/register",
    response_model=UserDict,
    summary="user register",
    name="user:register",
    tags=["User"])
def register(
    req: Request,
    payload: UserBase = Depends(UserBase.as_form),
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    # Check if user exist by email
    check_user_exist = crud_user.get_user_by_email(
        session=session, email=payload.email)
    if check_user_exist:
        raise HTTPException(
            status_code=409,
            detail=f"User {payload.email} already exist.")
    if payload.password:
        payload.password = payload.password.get_secret_value()
        payload.password = get_password_hash(payload.password)
    user = crud_user.add_user(
        session=session, payload=payload)
    user = user.serialize
    return user


@user_route.delete(
    "/user/{id:path}",
    responses={204: {"model": None}},
    status_code=HTTPStatus.NO_CONTENT,
    summary="delete user by id",
    name="user:delete",
    tags=["User"])
def delete(
    req: Request,
    id: int,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    crud_user.delete_user(session=session, id=id)
    return Response(status_code=HTTPStatus.NO_CONTENT.value)
