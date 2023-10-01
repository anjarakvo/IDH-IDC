"""create tag table

Revision ID: 9445c2cecb9e
Revises: 99c1425bb885
Create Date: 2023-09-22 09:31:28.556513

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import func
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9445c2cecb9e'
down_revision: Union[str, None] = '99c1425bb885'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'tag',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('created_by', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column(
            'created_at', sa.DateTime(),
            nullable=False, server_default=func.now()),
        sa.Column(
            'updated_at', sa.DateTime(), nullable=False,
            server_default=func.now(), onupdate=func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['created_by'], ['user.id'],
            name='tag_created_by_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_tag_id'), 'tag', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_tag_id'), table_name='tag')
    op.drop_table('tag')
