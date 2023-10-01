"""create organisation table

Revision ID: 04bb590dd921
Revises:
Create Date: 2023-09-22 08:12:37.156147

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04bb590dd921'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'organisation',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_organisation_id'), 'organisation', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_organisation_id'), table_name='organisation')
    op.drop_table('organisation')
