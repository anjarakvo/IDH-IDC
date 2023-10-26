"""alter_household_size_column_to_adult_and_child_on_segment_table

Revision ID: aec601de0715
Revises: 11d0c115913b
Create Date: 2023-10-26 00:42:00.781574

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aec601de0715'
down_revision: Union[str, None] = '11d0c115913b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('segment', 'household_size')
    op.add_column(
        'segment',
        sa.Column('adult', sa.Float(), nullable=True),
    )
    op.add_column(
        'segment',
        sa.Column('child', sa.Float(), nullable=True),
    )


def downgrade() -> None:
    op.add_column(
        'segment',
        sa.Column('household_size', sa.Float(), nullable=True),
    )
    op.drop_column('segment', 'adult')
    op.drop_column('segment', 'child')
