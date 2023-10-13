import enum
from db.connection import Base
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, SmallInteger,
    Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import BaseModel, SecretStr
from models.organisation import OrganisationDict
from fastapi import Form
from models.user_tag import UserTag
from models.user_case_access import UserCaseAccess
from models.enum_type import PermissionType
from models.user_business_unit import (
    UserBusinessUnit, UserBusinessUnitDetailDict
)


class UserRole(enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    editor = "editor"
    viewer = "viewer"
    user = "user"


class UserInfo(TypedDict):
    id: int
    fullname: str
    email: str
    role: UserRole
    active: bool
    business_unit_detail: Optional[UserBusinessUnitDetailDict]
    organisation_detail: OrganisationDict
    tags_count: int
    cases_count: int


class UserPageDict(TypedDict):
    id: int
    organisation: int
    email: str
    fullname: str
    role: UserRole
    active: bool
    tags_count: int
    cases_count: int


class UserDict(TypedDict):
    id: int
    organisation: int
    email: str
    fullname: str
    role: UserRole
    active: bool


class UserInvitation(TypedDict):
    id: int
    fullname: str
    email: str
    role: UserRole
    invitation_id: str


class EmailRecipient(TypedDict):
    Email: str
    Name: str


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    organisation = Column(Integer, ForeignKey("organisation.id"))
    email = Column(String, nullable=False, unique=True)
    fullname = Column(String, nullable=False)
    password = Column(String, nullable=True)
    role = Column(Enum(UserRole), nullable=False)
    permission = Column(Enum(PermissionType), nullable=True)
    is_active = Column(SmallInteger, nullable=False, default=0)
    invitation_id = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False,
        server_default=func.now(), onupdate=func.now()
    )

    user_organisation = relationship(
        "Organisation",
        cascade="all, delete",
        passive_deletes=True,
        back_populates="users",
    )
    user_tags = relationship(
        UserTag,
        cascade="all, delete",
        passive_deletes=True,
        back_populates="user_tag_detail",
    )
    user_case_access = relationship(
        UserCaseAccess,
        cascade="all, delete",
        passive_deletes=True,
        back_populates="user_case_access_detail",
    )
    user_business_unit_detail = relationship(
        UserBusinessUnit,
        cascade="all, delete",
        passive_deletes=True,
        back_populates="user_business_unit_user_detail"
    )

    def __init__(
        self,
        organisation: int,
        email: str,
        fullname: str,
        role: UserRole,
        id: Optional[int] = None,
        is_active: Optional[int] = 0,
        invitation_id: Optional[str] = None,
        password: Optional[str] = None,
        permission: Optional[PermissionType] = None,
    ):
        self.id = id
        self.organisation = organisation
        self.email = email
        self.fullname = fullname
        self.password = password
        self.role = role
        self.permission = permission
        self.is_active = is_active
        self.invitation_id = invitation_id

    def __repr__(self) -> int:
        return f"<User {self.id}>"

    @property
    def serialize(self) -> UserDict:
        return {
            "id": self.id,
            "organisation": self.organisation,
            "email": self.email,
            "fullname": self.fullname,
            "role": self.role,
            "active": self.is_active,
        }

    @property
    def to_user_info(self) -> UserInfo:
        business_unit_detail = [
            bu.to_business_unit_detail for bu
            in self.user_business_unit_detail
        ]
        business_unit_detail = (
            business_unit_detail[0] if business_unit_detail else None
        )
        return {
            "id": self.id,
            "fullname": self.fullname,
            "email": self.email,
            "role": self.role,
            "active": self.is_active,
            "business_unit_detail": business_unit_detail,
            "organisation_detail": self.user_organisation.serialize,
            "tags_count": len(self.user_tags),
            "cases_count": len(self.user_case_access),
        }

    @property
    def to_user_list(self) -> UserPageDict:
        return {
            "id": self.id,
            "organisation": self.organisation,
            "email": self.email,
            "fullname": self.fullname,
            "role": self.role,
            "active": self.is_active,
            "tags_count": len(self.user_tags),
            "cases_count": len(self.user_case_access),
        }

    @property
    def to_user_invitation(self) -> UserInvitation:
        return {
            "id": self.id,
            "fullname": self.fullname,
            "email": self.email,
            "role": self.role,
            "invitation_id": self.invitation_id,
        }

    @property
    def recipient(self) -> EmailRecipient:
        return {"Email": self.email, "Name": self.fullname}


class UserBase(BaseModel):
    id: Optional[int] = None
    organisation: int
    email: str
    fullname: str
    role: Optional[UserRole] = UserRole.user
    password: Optional[SecretStr] = None
    cases: Optional[List[int]] = None
    tags: Optional[List[int]] = None

    @classmethod
    def as_form(
        cls,
        organisation: int = Form(...),
        fullname: str = Form(...),
        email: str = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        cases: List[int] = Form(None),
        tags: List[int] = Form(None),
    ):
        return cls(
            fullname=fullname,
            email=email,
            password=password,
            organisation=organisation,
            role=role,
            cases=cases,
            tags=tags,
        )


class UserResponse(BaseModel):
    current: int
    data: List[UserPageDict]
    total: int
    total_page: int


class UserUpdateBase(BaseModel):
    fullname: str
    organisation: int
    role: Optional[UserRole] = None
    permission: Optional[PermissionType] = None
    is_active: Optional[bool] = False
    password: Optional[SecretStr] = None
    cases: Optional[List[int]] = None
    tags: Optional[List[int]] = None

    @classmethod
    def as_form(
        cls,
        fullname: str = Form(...),
        organisation: int = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        permission: PermissionType = Form(None),
        is_active: bool = Form(False),
        cases: List[int] = Form(None),
        tags: List[int] = Form(None),
    ):
        return cls(
            fullname=fullname,
            password=password,
            role=role,
            permission=permission,
            organisation=organisation,
            is_active=is_active,
            cases=cases,
            tags=tags,
        )
