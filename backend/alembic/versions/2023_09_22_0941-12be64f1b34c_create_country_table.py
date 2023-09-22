"""create country table

Revision ID: 12be64f1b34c
Revises: 9445c2cecb9e
Create Date: 2023-09-22 09:41:49.061030

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import func
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12be64f1b34c'
down_revision: Union[str, None] = '9445c2cecb9e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'country',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('parent', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column(
            'created_at', sa.DateTime(),
            nullable=False, server_default=func.now()),
        sa.Column(
            'updated_at', sa.DateTime(), nullable=False,
            server_default=func.now(), onupdate=func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_foreign_key(
        None, 'country', 'country',
        ['parent'], ['id'])
    op.create_index(
        op.f('ix_country_id'), 'country', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_country_id'), table_name='country')
    op.drop_table('country')
