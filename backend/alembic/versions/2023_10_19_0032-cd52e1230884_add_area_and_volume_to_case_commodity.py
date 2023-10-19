"""add area and volume to case commodity

Revision ID: cd52e1230884
Revises: 11d0c115913b
Create Date: 2023-10-19 00:32:23.328832

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "cd52e1230884"
down_revision: Union[str, None] = "11d0c115913b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "case_commodity", sa.Column("area_size_unit", sa.String(), nullable=False)
    )
    op.add_column(
        "case_commodity",
        sa.Column("volume_measurement_unit", sa.String(), nullable=False),
    )


def downgrade() -> None:
    op.drop_column("case_commodity", "volume_measurement_unit")
    op.drop_column("case_commodity", "area_size_unit")
