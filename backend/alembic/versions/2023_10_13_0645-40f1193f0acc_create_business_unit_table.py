"""create business unit table

Revision ID: 40f1193f0acc
Revises: 4acf424dcf01
Create Date: 2023-10-13 06:45:12.299766

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40f1193f0acc'
down_revision: Union[str, None] = '4acf424dcf01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'business_unit',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_business_unit_name'), 'business_unit',
        ['name'], unique=True
    )
    op.create_index(
        op.f('ix_business_unit_id'), 'business_unit',
        ['id'], unique=True
    )


def downgrade() -> None:
    op.drop_index(
        op.f('ix_business_unit_name'), table_name='business_unit')
    op.drop_index(
        op.f('ix_business_unit_id'), table_name='business_unit')
    op.drop_table('business_unit')
