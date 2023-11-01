import os
import sys
from db.connection import Base, SessionLocal, engine
import db.crud_user as crud
import db.crud_organisation as crud_organisation
from middleware import get_password_hash
from models.user import User, UserRole

inputs = [
    {"value": "fullname", "question": "Full Name"},
    {"value": "email", "question": "Email Address"},
    {"value": "organisation", "question": "Organisation Name"},
]

payload = {}
for i in inputs:
    v = i.get("value")
    q = i.get("question") or i.get("value")
    opt = i.get("options")
    if opt:
        q += " ["
        for oi, o in enumerate(opt):
            q += f"{o}"
            if (oi + 1) < len(opt):
                q += ", "
        q += "]"
    a = input(f"{q}: ")
    if opt:
        a = a.lower()
        if a not in opt:
            print("Invalid input")
            exit()
    if not len(a):
        print("Required")
        exit()
    payload.update({v: a})

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

Base.metadata.create_all(bind=engine)
session = SessionLocal()

org = crud_organisation.get_organisation_by_name(
    session=session, name=payload["organisation"]
)
if not org:
    org = crud_organisation.add_organisation(
        session=session, name=payload["organisation"]
    )
    print("Organisation named {} created".format(payload["organisation"]))
user = crud.get_user_by_email(session=session, email=payload["email"])

if user:
    user.fullname = payload["fullname"]
    user.organisation = org.id
    session.commit()
    session.flush()
    session.refresh(user)
    print(f"{user.email} of {org.name} updated")
    session.close()
    sys.exit()

payload["organisation"] = org.id
user = User(
    fullname=payload["fullname"],
    email=payload["email"],
    password=get_password_hash("password"),
    organisation=org.id,
    is_active=1,
    all_cases=1,
    role=UserRole.super_admin
)
session.add(user)
session.commit()
session.flush()
session.refresh(user)
print(f"{user.email} of {org.name} added")
session.close()
