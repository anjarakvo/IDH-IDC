"""create country region table

Revision ID: e035d03bf316
Revises: 94341a9d63ad
Create Date: 2023-10-30 10:07:27.965917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e035d03bf316'
down_revision: Union[str, None] = '94341a9d63ad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'country_region',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('region', sa.Integer(), sa.ForeignKey('region.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['country'], ['country.id'],
            name='country_region_country_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['region'], ['region.id'],
            name='country_region_region_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'country', 'region',
            name='country_region_unique')
    )
    op.create_index(
        op.f('ix_country_region_id'), 'country_region',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_country_region_id'), table_name='country_region')
    op.drop_constraint(
        'country_region_unique',
        'country_region',
        type_='unique'
    )
    op.drop_table('country_region')
