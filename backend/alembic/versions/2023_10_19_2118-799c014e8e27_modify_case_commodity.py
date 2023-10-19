"""modify_case_commodity

Revision ID: 799c014e8e27
Revises: cd52e1230884
Create Date: 2023-10-19 21:18:25.894892

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "799c014e8e27"
down_revision: Union[str, None] = "cd52e1230884"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    commodity_type_enum = postgresql.ENUM(
        "focus", "secondary", "tertiary", "diversified", name="case_commodity_type_enum"
    )
    commodity_type_enum.create(op.get_bind())
    op.add_column(
        "case_commodity",
        sa.Column(
            "commodity_type",
            sa.Enum(
                "focus",
                "secondary",
                "tertiary",
                "diversified",
                name="case_commodity_type_enum",
            ),
            nullable=False,
            server_default=sa.text("'focus'"),
        ),
    )
    op.create_unique_constraint(
        "case_commodity_type_unique",
        "case_commodity",
        ["case", "commodity", "commodity_type"],
    )
    op.drop_constraint("case_commodity_unique", "case_commodity", type_="unique")
    op.drop_column("case_commodity", "focus_commodity")


def downgrade() -> None:
    op.create_unique_constraint(
        "case_commodity_unique", "case_commodity", ["case", "commodity"]
    )
    op.drop_constraint("case_commodity_type_unique", "case_commodity", type_="unique")
    op.add_column(
        "case_commodity",
        sa.Column(
            "focus_commodity",
            sa.SmallInteger(),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )
    op.drop_column("case_commodity", "commodity_type")
    commodity_type_enum = postgresql.ENUM(
        "focus", "secondary", "tertiary", "diversified", name="case_commodity_type_enum"
    )
    commodity_type_enum.drop(op.get_bind())
