import enum
import json
from db.connection import Base
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey,
    SmallInteger, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional, List
from typing_extensions import TypedDict
from pydantic import (
    BaseModel, SecretStr, field_validator, ValidationInfo
)
from models.organisation import OrganisationDict
from fastapi import Form, HTTPException, status
from models.user_tag import UserTag
from models.user_case_access import UserCaseAccess
from models.user_business_unit import (
    UserBusinessUnit, UserBusinessUnitDetailDict,
)

tags_desc = "JSON stringify of tag ids [1, 2, 3]"
cases_desc = "JSON stringify of [{'case': 1, 'permission': 'edit/view'}]"
bus_desc = "JSON stringify of [{'business_unit': 1, 'role': 'admin/member'}]"


def json_load(value: Optional[str] = None):
    if value:
        return json.loads(value)
    return value


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
    business_unit_detail: Optional[List[UserBusinessUnitDetailDict]]
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
    all_cases = Column(SmallInteger, nullable=False, default=0)
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
    user_business_units = relationship(
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
        all_cases: Optional[int] = 0,
    ):
        self.id = id
        self.organisation = organisation
        self.email = email
        self.fullname = fullname
        self.password = password
        self.role = role
        self.all_cases = all_cases
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
            in self.user_business_units
        ]
        business_unit_detail = (
            business_unit_detail if business_unit_detail else None
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
    tags: Optional[str] = None
    cases: Optional[str] = None
    business_units: Optional[str] = None

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, value) -> dict:
        return json_load(value=value)

    @field_validator("cases")
    @classmethod
    def validate_cases(cls, value) -> dict:
        return json_load(value=value)

    @field_validator("business_units")
    @classmethod
    def validate_business_units(cls, value, info: ValidationInfo) -> dict:
        role = info.data.get("role", None)
        # business unit required for admin role
        if role and role.value == UserRole.admin.value and not value:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Business Unit required for admin role")
        return json_load(value=value)

    @classmethod
    def as_form(
        cls,
        organisation: int = Form(...),
        fullname: str = Form(...),
        email: str = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        tags: str = Form(None, description=tags_desc),
        cases: str = Form(None, description=cases_desc),
        business_units: str = Form(None, description=bus_desc),
    ):
        return cls(
            fullname=fullname,
            email=email,
            password=password,
            organisation=organisation,
            role=role,
            tags=tags,
            cases=cases,
            business_units=business_units,
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
    all_cases: Optional[bool] = False
    is_active: Optional[bool] = False
    password: Optional[SecretStr] = None
    tags: Optional[str] = None
    cases: Optional[str] = None
    business_units: Optional[str] = None

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, value) -> dict:
        return json_load(value=value)

    @field_validator("cases")
    @classmethod
    def validate_cases(cls, value) -> dict:
        return json_load(value=value)

    @field_validator("business_units")
    @classmethod
    def validate_business_units(cls, value, info: ValidationInfo) -> dict:
        role = info.data.get("role", None)
        # business unit required for admin role
        if role and role.value == UserRole.admin.value and not value:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Business Unit required for admin role")
        return json_load(value=value)

    @classmethod
    def as_form(
        cls,
        fullname: str = Form(...),
        organisation: int = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        all_cases: bool = Form(False),
        is_active: bool = Form(False),
        tags: str = Form(None, description=tags_desc),
        cases: str = Form(None, description=cases_desc),
        business_units: str = Form(None, description=bus_desc),
    ):
        return cls(
            fullname=fullname,
            password=password,
            role=role,
            all_cases=all_cases,
            organisation=organisation,
            is_active=is_active,
            tags=tags,
            cases=cases,
            business_units=business_units,
        )
