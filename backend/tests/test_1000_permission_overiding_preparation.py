import sys
import pytest

from sqlalchemy.orm import Session
from fastapi import FastAPI
from httpx import AsyncClient

from tests.test_000_main import Acc
from models.user import User, UserRole
from models.case import Case

from seeder.fake_seeder.fake_user import seed_fake_user
from seeder.fake_seeder.fake_case import seed_fake_case

pytestmark = pytest.mark.asyncio
sys.path.append("..")


account = Acc(email="super_admin@akvo.org", token=None)


class TestPermissionOveridingPreparation:
    @pytest.mark.asyncio
    async def test_seeder_fake_user(self, session: Session) -> None:
        seed_fake_user(session=session)
        users = session.query(User).all()
        for user in users:
            user_detail = user.to_user_detail
            # BU admin
            if user.role == UserRole.admin and user.all_cases:
                assert len(user_detail["business_units"]) > 0
            # Regular/Internal user (user with BU)
            if user.role == UserRole.user and user.all_cases:
                assert len(user_detail["business_units"]) > 0
            # External user (user without BU)
            if user.role == UserRole.admin and not user.all_cases:
                assert len(user_detail["business_units"]) == 0

    @pytest.mark.asyncio
    async def test_search_user_dropdown(
        self, app: FastAPI, session: Session, client: AsyncClient
    ) -> None:
        res = await client.get(
            app.url_path_for("user:search_user_dropdown"),
            params={"search": "Wayan"},
            headers={"Authorization": f"Bearer {account.token}"},
        )
        res = res.json()
        assert res == []

        res = await client.get(
            app.url_path_for("user:search_user_dropdown"),
            params={"search": "super_admin"},
            headers={"Authorization": f"Bearer {account.token}"},
        )
        res = res.json()
        assert res == [{"label": "John Doe <super_admin@akvo.org>", "value": 1}]

    @pytest.mark.asyncio
    async def test_seeder_fake_case(self, session: Session) -> None:
        cases = session.query(Case).count()
        assert cases == 3

        seed_fake_case(session=session)
        cases = session.query(Case).count()
        assert cases == 9
