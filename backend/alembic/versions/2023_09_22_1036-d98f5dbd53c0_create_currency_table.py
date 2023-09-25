"""create currency table

Revision ID: d98f5dbd53c0
Revises: d029ee3fcb2c
Create Date: 2023-09-25 05:32:00.590263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd98f5dbd53c0'
down_revision: Union[str, None] = '1527e42d477e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'currency',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('abbreviation', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['country'], ['country.id'],
            name='currency_country_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_currency_id'), 'currency',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_currency_id'),
        table_name='currency')
    op.drop_table('currency')
