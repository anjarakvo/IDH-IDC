"""create user project access table

Revision ID: 718e76de8207
Revises: 76e7ed4bab85
Create Date: 2023-09-22 10:04:15.311271

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '718e76de8207'
down_revision: Union[str, None] = '76e7ed4bab85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_project_access',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column('project', sa.Integer(), sa.ForeignKey('project.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['user'], ['user.id'],
            name='user_project_access_user_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['project'], ['project.id'],
            name='user_project_access_project_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'user', 'project',
            name='user_project_access_unique')
    )
    op.create_index(
        op.f('ix_user_project_access_id'), 'user_project_access',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_user_project_access_id'), table_name='user_project_access')
    op.drop_constraint(
        'user_project_access_unique',
        'user_project_access',
        type_='unique'
    )
    op.drop_table('user_project_access')
