import os
import sys
import pandas as pd
from db.connection import Base, engine, SessionLocal
from utils.truncator import truncatedb
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER_DIR = BASE_DIR + "/source/master/"
sys.path.append(BASE_DIR)


def seeder_master(session: Session, engine: create_engine):

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

    ## Commodity Categories and Commoditys
    truncatedb(session=session, table="commodity")
    truncatedb(session=session, table="commodity_category")
    commoditys = pd.read_csv(MASTER_DIR + "commoditys.csv")
    commodity_category = commoditys[["group_id", "group_name"]]
    commodity_category = commodity_category.rename(
        columns={"group_id": "id", "group_name": "name"}
    )
    commodity_category = commodity_category.drop_duplicates(subset="id").reset_index()
    commodity_category = commodity_category[["id", "name"]]
    commodity_category.to_sql("commodity_category", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Commodity Category")
    commoditys = commoditys[["id", "group_id", "name"]]
    commoditys = commoditys.rename(columns={"group_id": "commodity_category"})
    commoditys.to_sql("commodity", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Commodity")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_master(session=session, engine=engine)
