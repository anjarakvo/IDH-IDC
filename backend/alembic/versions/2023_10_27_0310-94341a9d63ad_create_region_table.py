"""create region table

Revision ID: 94341a9d63ad
Revises: dee6ae8bbbc4
Create Date: 2023-10-27 03:10:46.046816

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94341a9d63ad'
down_revision: Union[str, None] = 'dee6ae8bbbc4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'region',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_region_id'), 'region', ['id'], unique=True
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_region_id'), table_name="region")
    op.drop_table('region')
