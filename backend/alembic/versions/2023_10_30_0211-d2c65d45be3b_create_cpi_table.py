"""create cpi table

Revision ID: d2c65d45be3b
Revises: 6a5d05824ea0
Create Date: 2023-10-30 02:11:46.046888

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2c65d45be3b'
down_revision: Union[str, None] = '6a5d05824ea0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'cpi',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('value', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['country'], ['country.id'],
            name='cpi_country_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'country', 'year', name='cpi_country_year_unique')
    )
    op.create_index(op.f('ix_cpi_id'), 'cpi', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_cpi_id'), table_name='cpi')
    op.drop_constraint(
        'cpi_country_year_unique',
        'cpi',
        type_='unique'
    )
    op.drop_table('cpi')
