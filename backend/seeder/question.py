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


def seeder_question(session: Session, engine: create_engine):
    truncatedb(session=session, table="commodity_category_question")
    truncatedb(session=session, table="question")
    data = pd.read_csv(MASTER_DIR + "question.csv")
    question = data[["id", "parent", "text", "description", "default_value"]]
    question.to_sql("question", con=engine, if_exists="append", index=False)
    print("[DATABASE UPDATED]: Question")

    ## Commodity Categories Questions
    commodities = pd.read_csv(MASTER_DIR + "commodities.csv")
    commodity_group = commodities[["group_id", "group_name"]]
    data["commodity_group_names"] = data["description"].apply(
        lambda x: [i.strip() for i in x.split(",")]
    )
    group_question = data.explode("commodity_group_names")
    group_question["commodity_category"] = group_question[
        "commodity_group_names"
    ].apply(
        lambda x: commodity_group[commodity_group["group_name"] == x][
            "group_id"
        ].values[0]
    )
    group_question = group_question[["id", "commodity_category"]].rename(
        columns={"id": "question"}
    )
    group_question = group_question[["commodity_category", "question"]]
    group_question.to_sql(
        "commodity_category_question", con=engine, if_exists="append", index=False
    )
    print("[DATABASE UPDATED]: Question Category")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_question(session=session, engine=engine)
