"""create crop table

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
        'crop',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'crop_category', sa.Integer(),
            sa.ForeignKey('crop_category.id')),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['crop_category'], ['crop_category.id'],
            name='crop_crop_category_constraint')
    )
    op.create_index(
        op.f('ix_crop_name'), 'crop', ['name'], unique=True)
    op.create_index(
        op.f('ix_crop_id'), 'crop', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_crop_name'), table_name='crop')
    op.drop_index(op.f('ix_crop_id'), table_name='crop')
    op.drop_table('crop')
