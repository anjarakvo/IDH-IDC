import os
import db.crud_user as crud_user
from math import ceil
from middleware import (
    Token, authenticate_user, create_access_token, verify_user,
    get_password_hash, verify_admin
)
from fastapi import (
    Depends, HTTPException, status, APIRouter, Request, Query, Form,
)
from fastapi import Response
from fastapi.security import HTTPBearer
from fastapi.security import HTTPBasicCredentials as credentials
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db.connection import get_session
from models.user import (
    UserDict, UserBase, UserResponse, UserInfo, UserUpdateBase,
    UserInvitation, UserDetailDict, UserRole
)
from models.user_business_unit import UserBusinessUnitRole
from typing import Optional
from pydantic import SecretStr
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
        "user": user.to_user_info
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
    search: Optional[str] = Query(None),
    approved: Optional[bool] = Query(True),
    organisation: Optional[int] = Query(None),
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_admin(session=session, authenticated=req.state.authenticated)
    user = crud_user.get_all_user(
        session=session,
        search=search,
        organisation=organisation,
        approved=approved,
        skip=(limit * (page - 1)),
        limit=limit
    )
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    # count total user
    total = crud_user.count(
        session=session, search=search,
        organisation=organisation, approved=approved)
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
    response_model=UserInfo,
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
    return user.to_user_info


# user register by admin (user invitation)
@user_route.post(
    "/user/register",
    response_model=UserDict,
    summary="user register",
    name="user:register",
    tags=["User"])
def register(
    req: Request,
    payload: UserBase = Depends(UserBase.as_form),
    invitation_id: Optional[bool] = False,
    session: Session = Depends(get_session),
):
    # check invitation or not
    user = None
    if invitation_id:
        if hasattr(req.state, 'authenticated'):
            user = verify_admin(
                session=session,
                authenticated=req.state.authenticated)
        else:
            raise HTTPException(status_code=403, detail="Forbidden access")
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
    # generate business unit for editor/viewer
    if user and payload.role in [UserRole.editor, UserRole.viewer]:
        same_business_units = (
            crud_user.find_same_business_unit(session=session, user_id=user.id)
        )
        payload_bu = []
        for bu in same_business_units:
            payload_bu.append({
                "business_unit": bu.business_unit,
                "role": UserBusinessUnitRole.member.value,
            })
        payload.business_units = payload_bu
    # EOL generate business unit for editor/viewer
    user = crud_user.add_user(
        session=session, payload=payload, invitation_id=invitation_id)
    user = user.serialize
    return user


@user_route.get(
    "/user/invitation/{invitation_id:path}",
    response_model=UserInvitation,
    summary="get invitation detail",
    name="user:invitation",
    tags=["User"]
)
def invitation(
    req: Request,
    invitation_id: str,
    session: Session = Depends(get_session)
):
    user = crud_user.get_invitation(
        session=session, invitation_id=invitation_id)
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    return user.to_user_invitation


@user_route.post(
    "/user/invitation/{invitation_id:path}",
    response_model=Token,
    summary="get invitation detail",
    name="user:register_password",
    tags=["User"]
)
def change_password(
    req: Request,
    invitation_id: str,
    password: SecretStr = Form(...),
    session: Session = Depends(get_session)
):
    password = get_password_hash(password.get_secret_value())
    user = crud_user.accept_invitation(
        session=session, invitation_id=invitation_id, password=password)
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    access_token = create_access_token(data={"email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_user_info
    }


@user_route.get(
    "/user/{user_id:path}",
    response_model=UserDetailDict,
    summary="get user detail by id",
    name="user:get_by_id",
    tags=["User"])
def get_user_by_id(
    req: Request,
    user_id: int,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_admin(session=session, authenticated=req.state.authenticated)
    user = crud_user.get_user_by_id(session=session, id=user_id)
    return user.to_user_detail


@user_route.put(
    "/user/{user_id:path}",
    response_model=UserInfo,
    summary="update user by id",
    name="user:update",
    tags=["User"])
def update_user_by_id(
    req: Request,
    user_id: int,
    payload: UserUpdateBase = Depends(UserUpdateBase.as_form),
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_user(session=session, authenticated=req.state.authenticated)
    if payload.password:
        payload.password = payload.password.get_secret_value()
        payload.password = get_password_hash(payload.password)
    user = crud_user.update_user(session=session, id=user_id, payload=payload)
    return user.to_user_info


@user_route.delete(
    "/user/{user_id:path}",
    responses={204: {"model": None}},
    status_code=HTTPStatus.NO_CONTENT,
    summary="delete user by id",
    name="user:delete",
    tags=["User"])
def delete(
    req: Request,
    user_id: int,
    session: Session = Depends(get_session),
    credentials: credentials = Depends(security)
):
    verify_admin(session=session, authenticated=req.state.authenticated)
    crud_user.delete_user(session=session, id=user_id)
    return Response(status_code=HTTPStatus.NO_CONTENT.value)
