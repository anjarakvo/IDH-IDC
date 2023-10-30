import sys
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestRegionRoute():
    @pytest.mark.asyncio
    async def test_get_region_by_country(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(
            app.url_path_for(
                "region:get_options_by_country",
            ),
            params={'country_id': 1}
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{'label': 'Rural', 'value': 1}]

    @pytest.mark.asyncio
    async def test_get_region_by_country_return_empty_array(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        # without cred
        res = await client.get(
            app.url_path_for(
                "region:get_options_by_country",
            ),
            params={'country_id': 100}
        )
        assert res.status_code == 200
        res = res.json()
        assert res == []
