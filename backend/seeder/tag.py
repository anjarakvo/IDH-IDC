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


def seeder_tag(session: Session, engine: create_engine):

    ## tags
    truncatedb(session=session, table="tag")
    tags = pd.read_csv(MASTER_DIR + "tags.csv")
    tags = tags[["id", "name", "description"]]
    tags.to_sql("tag", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Tag")

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_tag(session=session, engine=engine)
