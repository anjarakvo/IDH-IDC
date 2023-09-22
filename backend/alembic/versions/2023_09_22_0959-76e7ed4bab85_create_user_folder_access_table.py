"""create user folder access table

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
        'user_folder_access',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column('folder', sa.Integer(), sa.ForeignKey('folder.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['user'], ['user.id'],
            name='user_folder_access_user_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['folder'], ['folder.id'],
            name='user_folder_access_folder_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_user_folder_access_id'), 'user_folder_access',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_user_folder_access_id'), table_name='user_folder_access')
    op.drop_table('user_folder_access')
