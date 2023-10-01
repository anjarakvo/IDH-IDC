"""create diversified crop table

Revision ID: aabb56bb921a
Revises: 718e76de8207
Create Date: 2023-09-22 10:06:41.109823

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aabb56bb921a'
down_revision: Union[str, None] = '718e76de8207'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'diversified_crop',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project', sa.Integer(), sa.ForeignKey('project.id')),
        sa.Column('crop', sa.Integer(), sa.ForeignKey('crop.id')),
        sa.Column('breakdown', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['project'], ['project.id'],
            name='diversified_crop_project_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['crop'], ['crop.id'],
            name='diversified_crop_crop_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_diversified_crop_id'), 'diversified_crop',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_diversified_crop_id'), table_name='diversified_crop')
    op.drop_table('diversified_crop')
