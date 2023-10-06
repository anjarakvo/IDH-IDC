import os
import sys
import pytest
from main import app
from httpx import AsyncClient
from fastapi.testclient import TestClient
from fastapi import FastAPI
from middleware import create_access_token
from middleware import decode_token
from sqlalchemy.orm import Session
from models.crop_category import CropCategory
from models.crop import Crop
from models.country import Country

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

client = TestClient(app)


class Acc:
    def __init__(self, email, token):
        self.email = email if email else "support@akvo.org"
        self.data = {"email": self.email}
        self.token = token if token else create_access_token(data=self.data)
        self.decoded = decode_token(self.token)


def test_read_main():
    response = client.get("/")
    assert response.json() == "OK"
    assert response.status_code == 200


class TestAddMasterDataWithoutDedenpentToUser():
    @pytest.mark.asyncio
    async def test_add_crop_categories_and_crops_master_data(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = [{
            "name": "Grains",
            "children": [
                {"name": "Wheat"},
                {"name": "Rice"},
                {"name": "Corn"}
            ]
        }, {
            "name": "Nuts",
            "children": [
                {"name": "Almonds"},
                {"name": "Walnuts"},
                {"name": "Pecans"}
            ]
        }]
        for val in payload:
            crop_category = CropCategory(name=val["name"])
            for child in val["children"]:
                crop = Crop(name=child["name"])
                crop_category.crops.append(crop)
            session.add(crop_category)
            session.commit()
            session.flush()
            session.refresh(crop_category)
        crop_categories = session.query(CropCategory).all()
        crop_categories = [val.serialize_with_crops for val in crop_categories]
        assert crop_categories == [{
            'id': 1,
            'name': 'Grains',
            'crops': [{
                'id': 1,
                'name': 'Wheat'
            }, {
                'id': 2,
                'name': 'Rice'
            }, {
                'id': 3,
                'name': 'Corn'
            }]
        }, {
            'id': 2,
            'name': 'Nuts',
            'crops': [{
                'id': 4,
                'name': 'Almonds'
            }, {
                'id': 5,
                'name': 'Walnuts'
            }, {
                'id': 6,
                'name': 'Pecans'
            }]
        }]

    @pytest.mark.asyncio
    async def test_add_country_master_data(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = [{
            "name": "Indonesia",
            "children": [
                {"name": "Bali"},
                {"name": "Lombok"}
            ]
        }, {
            "name": "India",
            "children": [
                {"name": "Delhi"},
                {"name": "Mumbai"}
            ]
        }]
        for val in payload:
            country = Country(name=val["name"])
            for child in val["children"]:
                country_child = Country(name=child["name"])
                country.children.append(country_child)
            session.add(country)
            session.commit()
            session.flush()
            session.refresh(country)
        countries = session.query(Country).filter(
            Country.parent.is_(None)).all()
        countries = [c.serialize for c in countries]
        assert countries == [{
            'id': 1,
            'parent': None,
            'name': 'Indonesia',
            'children': [{
                'id': 2,
                'parent': 1,
                'name': 'Bali',
                'children': []
            }, {
                'id': 3,
                'parent': 1,
                'name': 'Lombok',
                'children': []
            }]
        }, {
            'id': 4,
            'parent': None,
            'name': 'India',
            'children': [{
                'id': 5,
                'parent': 4,
                'name': 'Delhi',
                'children': []
            }, {
                'id': 6,
                'parent': 4,
                'name': 'Mumbai',
                'children': []
            }]
        }]
