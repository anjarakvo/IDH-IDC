import os
import sys
import pandas as pd
from core.config import generate_config_file
from db.connection import Base, engine, SessionLocal
from utils.truncator import truncatedb
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER_DIR = BASE_DIR + "/source/master/"
sys.path.append(BASE_DIR)


def seeder_organisation(session: Session, engine: create_engine):

    ## organization
    truncatedb(session=session, table="organisation")
    organisation = pd.read_csv(MASTER_DIR + "organisation.csv")
    organisation = organisation[["id", "name"]]
    organisation.to_sql("organisation", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Organisation")

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_organisation(session=session, engine=engine)
