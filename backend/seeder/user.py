import os
import sys
from db.connection import Base, SessionLocal, engine
import db.crud_user as crud
import db.crud_organisation as crud_organisation

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
    user = crud.update_user_by_id(
        session=session,
        id=user.id,
        fullname=payload["fullname"],
        organisation=org.id,
    )
    print(f"{user.email} of {org.name} updated")
    session.close()
    sys.exit()

user = crud.add_user(
    session=session,
    email=payload["email"],
    fullname=payload["fullname"],
    organisation=org.id,
    password="password"
)
print(f"{user.email} of {org.name} added")
session.close()
