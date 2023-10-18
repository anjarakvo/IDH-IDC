import db.crud_organisation as crud_org

from fastapi import (
    APIRouter, Request, Depends
)
from fastapi.security import (
    HTTPBearer, HTTPBasicCredentials as credentials
)
from sqlalchemy.orm import Session
from typing import List

from db.connection import get_session
from models.organisation import OrganisationOption

security = HTTPBearer()
organisation_route = APIRouter()


@organisation_route.get(
    "/organisation/options",
    response_model=List[OrganisationOption],
    summary="get organisation options",
    name="organisation:get_options",
    tags=["Organisation"]
)
def get_organisation_options(
    req: Request,
    session: Session = Depends(get_session),
):
    orgs = crud_org.get_all_organisation(session=session)
    return [o.to_option for o in orgs]
