"""alter living income benchmark table

Revision ID: 6a5d05824ea0
Revises: e035d03bf316
Create Date: 2023-10-27 06:21:49.208459

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a5d05824ea0'
down_revision: Union[str, None] = 'e035d03bf316'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        'living_income_benchmark_currency_constraint',
        'living_income_benchmark',
        type_='foreignkey'
    )
    op.drop_constraint(
        'country_currency_unique',
        'living_income_benchmark',
        type_='unique'
    )
    op.drop_column('living_income_benchmark', 'currency')
    op.drop_column('living_income_benchmark', 'value')
    op.add_column(
        'living_income_benchmark',
        sa.Column('region', sa.Integer(), sa.ForeignKey('region.id')),
    )
    op.create_foreign_key(
        'living_income_benchmark_region_constraint',
        'living_income_benchmark',
        'region',
        ['region'],
        ['id'],
        ondelete='CASCADE'
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('household_size', sa.Float(), nullable=True),
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('source', sa.String(), nullable=True),
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('lcu', sa.Float(), nullable=True),
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('usd', sa.Float(), nullable=True),
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('eur', sa.Float(), nullable=True),
    )


def downgrade() -> None:
    op.add_column(
        'living_income_benchmark',
        sa.Column('currency', sa.Integer(), sa.ForeignKey('currency.id')),
    )
    op.create_foreign_key(
        'living_income_benchmark_currency_constraint',
        'living_income_benchmark',
        'currency',
        ['currency'],
        ['id'],
        ondelete='CASCADE'
    )
    op.create_unique_constraint(
        'country_currency_unique',
        'living_income_benchmark',
        ['country', 'currency']
    )
    op.add_column(
        'living_income_benchmark',
        sa.Column('value', sa.Float(), nullable=True),
    )
    op.drop_constraint(
        'living_income_benchmark_region_constraint',
        'living_income_benchmark',
        type_='foreignkey'
    )
    op.drop_column('living_income_benchmark', 'region')
    op.drop_column('living_income_benchmark', 'household_size')
    op.drop_column('living_income_benchmark', 'source')
    op.drop_column('living_income_benchmark', 'lcu')
    op.drop_column('living_income_benchmark', 'usd')
    op.drop_column('living_income_benchmark', 'eur')
