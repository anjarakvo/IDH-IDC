"""create crop category table

Revision ID: 0fb22cec7712
Revises: 1b5c1189f110
Create Date: 2023-09-22 08:43:58.711264

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import func
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0fb22cec7712'
down_revision: Union[str, None] = '1b5c1189f110'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'crop_category',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column(
            'created_at', sa.DateTime(),
            nullable=False, server_default=func.now()),
        sa.Column(
            'updated_at', sa.DateTime(), nullable=False,
            server_default=func.now(), onupdate=func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_crop_category_name'), 'crop_category', ['name'], unique=True)
    op.create_index(
        op.f('ix_crop_category_id'), 'crop_category', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_crop_category_name'), table_name='crop_category')
    op.drop_index(op.f('ix_crop_category_id'), table_name='crop_category')
    op.drop_table('crop_category')
