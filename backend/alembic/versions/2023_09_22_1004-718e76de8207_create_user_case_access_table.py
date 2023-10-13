"""create user case access table

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
        'user_case_access',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column('case', sa.Integer(), sa.ForeignKey('case.id')),
        sa.Column(
            'permission',
            sa.Enum(
                'edit',
                'view',
                name='user_case_access_permission'
            ), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['user'], ['user.id'],
            name='user_case_access_user_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['case'], ['case.id'],
            name='user_case_access_case_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'user', 'case',
            name='user_case_access_unique')
    )
    op.create_index(
        op.f('ix_user_case_access_id'), 'user_case_access',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_user_case_access_id'), table_name='user_case_access')
    op.drop_constraint(
        'user_case_access_unique',
        'user_case_access',
        type_='unique'
    )
    op.drop_table('user_case_access')
