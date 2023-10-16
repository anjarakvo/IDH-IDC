"""create user tag table

Revision ID: 76e7ed4bab85
Revises: 23904705dc42
Create Date: 2023-09-22 09:59:14.537148

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '76e7ed4bab85'
down_revision: Union[str, None] = '23904705dc42'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_tag',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column('tag', sa.Integer(), sa.ForeignKey('tag.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['user'], ['user.id'],
            name='user_tag_user_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['tag'], ['tag.id'],
            name='user_tag_tag_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'user', 'tag',
            name='user_tag_unique')
    )
    op.create_index(
        op.f('ix_user_tag_id'), 'user_tag',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_user_tag_id'), table_name='user_tag')
    op.drop_constraint(
        'user_tag_unique',
        'user_tag',
        type_='unique'
    )
    op.drop_table('user_tag')
