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


def seeder_country(session: Session, engine: create_engine):

    ## Country and Currency
    truncatedb(session=session, table="country")
    truncatedb(session=session, table="currency")
    data = pd.read_csv(MASTER_DIR + "countries.csv")
    countries = data[["id", "country"]].rename(columns={"country": "name"})
    countries["parent"] = None
    print("[DATABASE UPDATED]: Country")
    countries.to_sql("country", con=engine, if_exists="append", index=False)
    currencies = data[["id", "currency", "abbreviation"]].rename(
        columns={"currency": "name"}
    )
    currencies["country"] = data["id"]
    currencies.to_sql("currency", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Currency")

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_country(session=session, engine=engine)
