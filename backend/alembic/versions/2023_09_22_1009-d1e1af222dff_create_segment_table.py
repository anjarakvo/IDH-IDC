"""create segment table

Revision ID: d1e1af222dff
Revises: aabb56bb921a
Create Date: 2023-09-22 10:09:28.228499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd1e1af222dff'
down_revision: Union[str, None] = 'aabb56bb921a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'segment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('case', sa.Integer(), sa.ForeignKey('case.id')),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('target', sa.Float(), nullable=True),
        sa.Column('household_size', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['case'], ['case.id'],
            name='segment_case_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'case', 'name',
            name='case_segment_name_unique')
    )
    op.create_index(
        op.f('ix_segment_id'), 'segment',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_segment_id'), table_name='segment')
    op.drop_constraint(
        'case_segment_name_unique',
        'segment',
        type_='unique'
    )
    op.drop_table('segment')
