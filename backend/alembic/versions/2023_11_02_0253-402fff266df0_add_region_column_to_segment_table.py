"""add region column to segment table

Revision ID: 402fff266df0
Revises: d2c65d45be3b
Create Date: 2023-11-02 02:53:03.619293

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '402fff266df0'
down_revision: Union[str, None] = 'd2c65d45be3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'segment',
        sa.Column('region', sa.Integer(), sa.ForeignKey('region.id')),
    )
    op.create_foreign_key(
        'segment_region_constraint',
        'segment',
        'region',
        ['region'],
        ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    op.drop_constraint(
        'segment_region_constraint',
        'segment',
        type_='foreignkey'
    )
    op.drop_column('segment', 'region')
