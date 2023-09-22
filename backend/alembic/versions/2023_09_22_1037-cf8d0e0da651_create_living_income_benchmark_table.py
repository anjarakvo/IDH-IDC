"""create living income benchmark table

Revision ID: cf8d0e0da651
Revises: 1527e42d477e
Create Date: 2023-09-22 10:37:12.889515

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cf8d0e0da651'
down_revision: Union[str, None] = '1527e42d477e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'living_income_benchmark',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('currency', sa.String(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['country'], ['country.id'],
            name='living_income_benchmark_country_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_living_income_benchmark_id'), 'living_income_benchmark',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_living_income_benchmark_id'),
        table_name='living_income_benchmark')
    op.drop_table('living_income_benchmark')
