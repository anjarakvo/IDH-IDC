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

    ## Bussiness Unit
    truncatedb(session=session, table="business_unit")
    business_unit = pd.read_csv(MASTER_DIR + "business_unit.csv")
    business_unit = business_unit[["id", "name"]]
    business_unit.to_sql("business_unit", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Business Unit")

    ## organization
    truncatedb(session=session, table="organisation")
    organisation = pd.read_csv(MASTER_DIR + "organisation.csv")
    organisation = organisation[["id", "name"]]
    organisation.to_sql("organisation", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Organisation")

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
    seeder_master(session=session, engine=engine)
