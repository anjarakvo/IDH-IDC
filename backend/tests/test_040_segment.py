import sys
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session
from tests.test_000_main import Acc

sys.path.append("..")

non_admin_account = Acc(email="support@akvo.org", token=None)
admin_account = Acc(email="super_admin@akvo.org", token=None)


class TestSegmentRoute():
    # test_get_all_segment_return_404
    @pytest.mark.asyncio
    async def test_create_segment(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        payload = [{
            "name": "Segment 1",
            "case": 1,
            "target": 1000,
            "household_size": 20
        }]
        # without cred
        res = await client.post(
            app.url_path_for("segment:create"),
            json=payload,
        )
        assert res.status_code == 403
        # with normal user cred
        res = await client.post(
            app.url_path_for("segment:create"),
            headers={"Authorization": f"Bearer {non_admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 1,
            'case': 1,
            'name': 'Segment 1',
            'target': 1000.0,
            'household_size': 20.0
        }]
        # with admin user cred
        payload = [{
            "name": "Segment 2",
            "case": 1,
            "target": 2000,
            "household_size": 30
        }, {
            "name": "Segment 3",
            "case": 1,
            "target": 3000,
            "household_size": 40
        }]
        res = await client.post(
            app.url_path_for("segment:create"),
            headers={"Authorization": f"Bearer {admin_account.token}"},
            json=payload,
        )
        assert res.status_code == 200
        res = res.json()
        assert res == [{
            'id': 2,
            'case': 1,
            'name': 'Segment 2',
            'target': 2000.0,
            'household_size': 30.0
        }, {
            'id': 3,
            'case': 1,
            'name': 'Segment 3',
            'target': 3000.0,
            'household_size': 40.0
        }]

    # test_get_all_segment
    # test_get_segment_by_id
    # test_update_segment
