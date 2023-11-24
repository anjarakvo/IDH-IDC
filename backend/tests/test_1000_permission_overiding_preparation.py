import sys
import pytest
from sqlalchemy.orm import Session

from models.user import User, UserRole

from seeder.fake_seeder.fake_user import seed_fake_user

pytestmark = pytest.mark.asyncio
sys.path.append("..")


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
