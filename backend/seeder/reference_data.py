import os
import sys
import pandas as pd
import numpy as np
from core.config import generate_config_file
from db.connection import Base, engine, SessionLocal

from utils.truncator import truncatedb
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.reference_data import ReferenceData
from models.country import Country
from models.commodity import Commodity

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER_DIR = BASE_DIR + "/source/master/"
sys.path.append(BASE_DIR)


def seeder_reference_data(session: Session):
    # reference data
    truncatedb(session=session, table="reference_data")
    rfd = pd.read_csv(MASTER_DIR + "reference_data.csv")
    rfd.replace({np.nan: None}, inplace=True)
    for index, row in rfd.iterrows():
        country = (
            session.query(Country)
            .filter(func.lower(Country.name) == func.lower(row["country"]))
            .first()
        )
        commodity = (
            session.query(Commodity)
            .filter(func.lower(Commodity.name) == func.lower(row["commodity"]))
            .first()
        )
        if not country or not commodity:
            print(
                f"[ERROR]: Country or Commodity not found for ID: {row['id']}"
            )
            continue
        # find prev data
        rfd = (
            session.query(ReferenceData)
            .filter(ReferenceData.id == row["id"])
            .first()
        )
        # value
        area = row["area"]
        if area and isinstance(area, str):
            area = float(str(area).replace(",", ""))
        volume = row["volume"]
        if volume and isinstance(volume, str):
            volume = float(str(row["volume"]).replace(",", ""))
        price = row["price"]
        if price and isinstance(price, str):
            price = float(str(row["price"]).replace(",", ""))
        cost_of_production = row["cost_of_production"]
        if cost_of_production and isinstance(cost_of_production, str):
            cost_of_production = float(
                str(row["cost_of_production"]).replace(",", "")
            )
        diversified_income = row["diversified_income"]
        if diversified_income and isinstance(diversified_income, str):
            diversified_income = float(
                str(row["diversified_income"]).replace(",", "")
            )

        if rfd:
            # update
            rfd.country = country.id
            rfd.commodity = commodity.id
            rfd.region = row["region"]
            rfd.currency = row["currency"]
            rfd.year = row["year"]
            rfd.source = row["source"]
            rfd.link = row["link"]
            rfd.notes = row["notes"]
            rfd.confidence_level = row["confidence_level"]
            rfd.range = row["range"]
            rfd.area = area
            rfd.volume = volume
            rfd.price = price
            rfd.cost_of_production = cost_of_production
            rfd.diversified_income = diversified_income
            rfd.area_size_unit = row["area_size_unit"]
            rfd.volume_measurement_unit = row["volume_measurement_unit"]
            rfd.cost_of_production_unit = row["cost_of_production_unit"]
            rfd.diversified_income_unit = row["diversified_income_unit"]
            rfd.price_unit = row["price_unit"]
            rfd.type_area = row["type_area"]
            rfd.type_volume = row["type_volume"]
            rfd.type_price = row["type_price"]
            rfd.type_cost_of_production = row["type_cost_of_production"]
            rfd.type_diversified_income = row["type_diversified_income"]
            rfd.created_by = None
        else:
            # create
            rfd = ReferenceData(
                id=row["id"],
                country=country.id,
                commodity=commodity.id,
                region=row["region"],
                currency=row["currency"],
                year=row["year"],
                source=row["source"],
                link=row["link"],
                notes=row["notes"],
                confidence_level=row["confidence_level"],
                range=row["range"],
                area=area,
                volume=volume,
                price=price,
                cost_of_production=cost_of_production,
                diversified_income=diversified_income,
                area_size_unit=row["area_size_unit"],
                volume_measurement_unit=row["volume_measurement_unit"],
                cost_of_production_unit=row["cost_of_production_unit"],
                diversified_income_unit=row["diversified_income_unit"],
                price_unit=row["price_unit"],
                type_area=row["type_area"],
                type_volume=row["type_volume"],
                type_price=row["type_price"],
                type_cost_of_production=row["type_cost_of_production"],
                type_diversified_income=row["type_diversified_income"],
                created_by=None,
            )
            session.add(rfd)
        session.commit()
        session.flush()
        session.refresh(rfd)
    print("[DATABASE UPDATED]: Reference Data")
    session.close()

    generate_config_file()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seeder_reference_data(session=session)
