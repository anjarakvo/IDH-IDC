"""create user table

Revision ID: 1b5c1189f110
Revises: 04bb590dd921
Create Date: 2023-09-22 08:13:08.249570

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import func
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1b5c1189f110'
down_revision: Union[str, None] = '04bb590dd921'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'organisation', sa.Integer(),
            sa.ForeignKey('organisation.id')),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('fullname', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=True),
        sa.Column(
            'role',
            sa.Enum(
                'super_admin',
                'admin',
                'editor',
                'viewer',
                'user',
                name='user_role'
            ), nullable=False),
        sa.Column(
            'all_cases',
            sa.SmallInteger(),
            server_default='0', nullable=False,
            comment='Whether all cases or only create'),
        sa.Column(
            'is_active', sa.SmallInteger(),
            server_default='0', nullable=False),
        sa.Column('invitation_id', sa.Text(), default=None, nullable=True),
        sa.Column(
            'created_at', sa.DateTime(),
            nullable=False, server_default=func.now()),
        sa.Column(
            'updated_at', sa.DateTime(), nullable=False,
            server_default=func.now(), onupdate=func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['organisation'], ['organisation.id'],
            name='user_organisation_constraint')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.execute('DROP TYPE user_role')
