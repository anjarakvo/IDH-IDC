"""create case commodity table

Revision ID: aabb56bb921a
Revises: 718e76de8207
Create Date: 2023-09-22 10:06:41.109823

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "aabb56bb921a"
down_revision: Union[str, None] = "718e76de8207"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "case_commodity",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("case", sa.Integer(), sa.ForeignKey("case.id")),
        sa.Column("commodity", sa.Integer()),
        sa.Column(
            "commodity_type",
            sa.Enum(
                "focus",
                "secondary",
                "tertiary",
                "diversified",
                name="case_commodity_type",
            ),
            nullable=False,
        ),
        sa.Column("breakdown", sa.SmallInteger(), server_default="0", nullable=False),
        sa.Column("area_size_unit", sa.String(), nullable=False),
        sa.Column("volume_measurement_unit", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["case"],
            ["case.id"],
            name="case_commodity_case_constraint",
            ondelete="CASCADE",
        ),
        sa.UniqueConstraint(
            "case", "commodity", "commodity_type", name="case_commodity_unique"
        ),
    )
    op.create_index(op.f("ix_case_commodity_id"), "case_commodity", ["id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_case_commodity_id"), table_name="case_commodity")
    op.drop_constraint("case_commodity_unique", "case_commodity", type_="unique")
    op.drop_table("case_commodity")
    op.execute('DROP TYPE "case_commodity_type"')
