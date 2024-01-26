"""alter float columns into string in reference data table

Revision ID: be2d762cd54b
Revises: 750d06ba6a1e
Create Date: 2024-01-25 23:10:37.480240

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "be2d762cd54b"
down_revision: Union[str, None] = "750d06ba6a1e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("reference_data", "notes", type_=sa.Text(), nullable=True)
    op.alter_column("reference_data", "area", type_=sa.String(), nullable=True)
    op.alter_column(
        "reference_data", "volume", type_=sa.String(), nullable=True
    )
    op.alter_column(
        "reference_data", "price", type_=sa.String(), nullable=True
    )
    op.alter_column(
        "reference_data",
        "cost_of_production",
        type_=sa.String(),
        nullable=True,
    )
    op.alter_column(
        "reference_data",
        "diversified_income",
        type_=sa.String(),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "reference_data", "notes", type_=sa.String(), nullable=True
    )

    op.execute(
        """
        UPDATE reference_data
        SET area = NULL
        WHERE area IS NOT NULL
        AND area !~ '^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$'
        """
    )
    op.execute(
        """
        ALTER TABLE reference_data
        ALTER COLUMN area TYPE double precision
        USING area::double precision
        """
    )

    op.execute(
        """
        UPDATE reference_data
        SET volume = NULL
        WHERE volume IS NOT NULL
        AND volume !~ '^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$'
        """
    )
    op.execute(
        """
        ALTER TABLE reference_data
        ALTER COLUMN volume TYPE double precision
        USING volume::double precision
        """
    )

    op.execute(
        """
        UPDATE reference_data
        SET price = NULL
        WHERE price IS NOT NULL
        AND price !~ '^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$'
        """
    )
    op.execute(
        """
        ALTER TABLE reference_data
        ALTER COLUMN price TYPE double precision
        USING price::double precision
        """
    )

    op.execute(
        """
        UPDATE reference_data
        SET cost_of_production = NULL
        WHERE cost_of_production IS NOT NULL
        AND cost_of_production !~ '^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$'
        """
    )
    op.execute(
        """
        ALTER TABLE reference_data
        ALTER COLUMN cost_of_production TYPE double precision
        USING cost_of_production::double precision
        """
    )

    op.execute(
        """
        UPDATE reference_data
        SET diversified_income = NULL
        WHERE diversified_income IS NOT NULL
        AND diversified_income !~ '^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$'
        """
    )
    op.execute(
        """
        ALTER TABLE reference_data
        ALTER COLUMN diversified_income TYPE double precision
        USING diversified_income::double precision
        """
    )
