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
from models.user_project_access import UserProjectAccess


class UserRole(enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    editor = "editor"
    viewer = "viewer"
    user = "user"


class UserPermission(enum.Enum):
    edit = "edit"
    view = "view"


class UserWithOrg(TypedDict):
    id: int
    fullname: str
    email: str
    role: UserRole
    active: bool
    organisation_detail: OrganisationDict
    tags_count: int
    projects_count: int


class UserPageDict(TypedDict):
    id: int
    organisation: int
    email: str
    fullname: str
    role: UserRole
    active: bool
    tags_count: int
    projects_count: int


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
    permission = Column(Enum(UserPermission), nullable=True)
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
    user_project_access = relationship(
        UserProjectAccess,
        cascade="all, delete",
        passive_deletes=True,
        back_populates="user_project_access_detail",
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
        permission: Optional[UserPermission] = None,
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
    def to_user_with_org(self) -> UserDict:
        return {
            "id": self.id,
            "fullname": self.fullname,
            "email": self.email,
            "role": self.role,
            "active": self.is_active,
            "organisation_detail": self.user_organisation.serialize,
            "tags_count": len(self.user_tags),
            "projects_count": len(self.user_project_access),
        }

    @property
    def to_user_list(self) -> UserDict:
        return {
            "id": self.id,
            "organisation": self.organisation,
            "email": self.email,
            "fullname": self.fullname,
            "role": self.role,
            "active": self.is_active,
            "tags_count": len(self.user_tags),
            "projects_count": len(self.user_project_access),
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
    projects: Optional[List[int]] = None
    tags: Optional[List[int]] = None

    @classmethod
    def as_form(
        cls,
        organisation: int = Form(...),
        fullname: str = Form(...),
        email: str = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        projects: List[int] = Form(None),
        tags: List[int] = Form(None),
    ):
        return cls(
            fullname=fullname,
            email=email,
            password=password,
            organisation=organisation,
            role=role,
            projects=projects,
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
    permission: Optional[UserPermission] = None
    is_active: Optional[bool] = False
    password: Optional[SecretStr] = None
    projects: Optional[List[int]] = None
    tags: Optional[List[int]] = None

    @classmethod
    def as_form(
        cls,
        fullname: str = Form(...),
        organisation: int = Form(...),
        password: SecretStr = Form(None),
        role: UserRole = Form(None),
        permission: UserPermission = Form(None),
        is_active: bool = Form(False),
        projects: List[int] = Form(None),
        tags: List[int] = Form(None),
    ):
        return cls(
            fullname=fullname,
            password=password,
            role=role,
            permission=permission,
            organisation=organisation,
            is_active=is_active,
            projects=projects,
            tags=tags,
        )
