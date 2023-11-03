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


def seeder_commodity(session: Session, engine: create_engine):

    ## Commodity Categories and Commoditys
    truncatedb(session=session, table="commodity")
    truncatedb(session=session, table="commodity_category")
    commodities = pd.read_csv(MASTER_DIR + "commodities.csv")
    commodity_category = commodities[["group_id", "group_name"]]
    commodity_category = commodity_category.rename(
        columns={"group_id": "id", "group_name": "name"}
    )
    commodity_category = commodity_category.drop_duplicates(subset="id").reset_index()
    commodity_category = commodity_category[["id", "name"]]
    commodity_category.to_sql(
        "commodity_category", con=engine, if_exists="append", index=False
    )
    print("[DATABASE UPDATED]: Commodity Category")
    commodities = commodities[["id", "group_id", "name"]]
    commodities = commodities.rename(columns={"group_id": "commodity_category"})
    commodities.to_sql("commodity", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Commodity")

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_commodity(session=session, engine=engine)
