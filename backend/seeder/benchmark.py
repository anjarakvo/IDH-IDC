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


def seeder_benchmark(session: Session, engine: create_engine):

    ## living income benchmark
    truncatedb(session=session, table="living_income_benchmark")
    li_benchmark = pd.read_csv(MASTER_DIR + "li_benchmark.csv")
    # Filter rows where the list does not contain any string values
    filtered_lib = li_benchmark[li_benchmark["country_id"] != li_benchmark["country"]]
    filtered_lib.drop(columns=['country', 'region'], inplace=True)
    filtered_lib = filtered_lib.rename(columns={
        "LCU": "lcu",
        "USD": "usd",
        "EUR": "eur",
        "country_id": "country",
        "region_id": "region",
    })
    filtered_lib = filtered_lib.fillna(0)
    filtered_lib.to_sql("living_income_benchmark", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Living Income Benchmark")

    ## CPI
    truncatedb(session=session, table="cpi")
    cpi = pd.read_csv(MASTER_DIR + "cpi.csv")
    # Filter rows where the list does not contain any string values
    filtered_cpi = cpi[cpi["country_id"] != cpi["country"]]
    filtered_cpi.drop(columns=['country'], inplace=True)
    filtered_cpi = filtered_cpi.rename(columns={
        "country_id": "country",
    })
    filtered_cpi = filtered_cpi.fillna(0)
    filtered_cpi.to_sql("cpi", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: CPI")

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_benchmark(session=session, engine=engine)
