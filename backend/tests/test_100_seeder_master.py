# import sys
# import pytest
# from seeder.master import seeder_master
# from models.commodity_category import CommodityCategory
# from models.country import Country
# from models.commodity import Commodity
# from sqlalchemy import create_engine
# from sqlalchemy.orm import Session
# from db.connection import get_db_url

# pytestmark = pytest.mark.asyncio
# sys.path.append("..")


# class TestSeederMaster:
#     @pytest.mark.asyncio
#     async def test_seeder_master(self, session: Session) -> None:
#         commodity_categories = session.query(CommodityCategory).all()
#         commodity_categories = [val.serialize_with_commoditys for val in commodity_categories]
#         assert commodity_categories == [
#             {
#                 "id": 1,
#                 "name": "Grains",
#                 "commoditys": [
#                     {"id": 1, "name": "Wheat"},
#                     {"id": 2, "name": "Rice"},
#                     {"id": 3, "name": "Corn"},
#                 ],
#             },
#             {
#                 "id": 2,
#                 "name": "Nuts",
#                 "commoditys": [
#                     {"id": 4, "name": "Almonds"},
#                     {"id": 5, "name": "Walnuts"},
#                     {"id": 6, "name": "Pecans"},
#                 ],
#             },
#         ]
#         countries = session.query(Country).filter(Country.parent.is_(None)).all()
#         countries = [c.serialize for c in countries]
#         assert countries == [
#             {
#                 "id": 1,
#                 "parent": None,
#                 "name": "Indonesia",
#                 "children": [
#                     {"id": 2, "parent": 1, "name": "Bali", "children": []},
#                     {"id": 3, "parent": 1, "name": "Lombok", "children": []},
#                 ],
#             },
#             {
#                 "id": 4,
#                 "parent": None,
#                 "name": "India",
#                 "children": [
#                     {"id": 5, "parent": 4, "name": "Delhi", "children": []},
#                     {"id": 6, "parent": 4, "name": "Mumbai", "children": []},
#                 ],
#             },
#         ]
#         ## BEGIN TEST
#         engine = create_engine(get_db_url())
#         seeder_master(session=session, engine=engine)
#         countries_count = session.query(Country).count()
#         assert countries_count == 249
#         commodity_category_count = session.query(CommodityCategory).count()
#         assert commodity_category_count == 3
#         commodity_count = session.query(Commodity).count()
#         assert commodity_count == 11
