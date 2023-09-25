from typing import Optional
from sqlalchemy.orm import Session
from models.organisation import Organisation, OrganisationDict


def add_organisation(
    session: Session,
    name: str,
    id: Optional[int] = None,
) -> OrganisationDict:
    organisation = Organisation(id=id, name=name)
    session.add(organisation)
    session.commit()
    session.flush()
    session.refresh(organisation)
    return organisation


def get_organisation_by_name(session: Session, name: str) -> Organisation:
    return (
        session.query(Organisation)
        .filter(Organisation.name.ilike("%{}%".format(name.lower().strip())))
        .first()
    )
