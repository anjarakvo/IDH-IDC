"""create commodity table

Revision ID: 99c1425bb885
Revises: 0fb22cec7712
Create Date: 2023-09-22 09:04:21.615121

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '99c1425bb885'
down_revision: Union[str, None] = '0fb22cec7712'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'commodity',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'commodity_category', sa.Integer(),
            sa.ForeignKey('commodity_category.id')),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['commodity_category'], ['commodity_category.id'],
            name='commodity_commodity_category_constraint')
    )
    op.create_index(
        op.f('ix_commodity_name'), 'commodity', ['name'], unique=True)
    op.create_index(
        op.f('ix_commodity_id'), 'commodity', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_commodity_name'), table_name='commodity')
    op.drop_index(op.f('ix_commodity_id'), table_name='commodity')
    op.drop_table('commodity')
