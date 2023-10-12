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

    ## Crop Categories and Crops
    truncatedb(session=session, table="crop")
    truncatedb(session=session, table="crop_category")
    crops = pd.read_csv(MASTER_DIR + "crops.csv")
    crop_category = crops[["group_id", "group_name"]]
    crop_category = crop_category.rename(
        columns={"group_id": "id", "group_name": "name"}
    )
    crop_category = crop_category.drop_duplicates(subset="id").reset_index()
    crop_category = crop_category[["id", "name"]]
    crop_category.to_sql("crop_category", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Crop Category")
    crops = crops[["id", "group_id", "name"]]
    crops = crops.rename(columns={"group_id": "crop_category"})
    crops.to_sql("crop", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Crop")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_master(session=session, engine=engine)
