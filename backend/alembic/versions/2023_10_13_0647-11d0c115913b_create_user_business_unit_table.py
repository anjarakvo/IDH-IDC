"""create user business unit table

Revision ID: 11d0c115913b
Revises: 40f1193f0acc
Create Date: 2023-10-13 06:47:18.771580

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '11d0c115913b'
down_revision: Union[str, None] = '40f1193f0acc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_business_unit',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column(
            'business_unit', sa.Integer(),
            sa.ForeignKey('business_unit.id')
        ),
        sa.Column(
            'role',
            sa.Enum(
                'admin',
                'member',
                name='user_business_unit_role'
            ), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['user'], ['user.id'],
            name='user_business_unit_user_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['business_unit'], ['business_unit.id'],
            name='user_business_unit_business_unit_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'user', 'business_unit',
            name='user_business_unit_unique')
    )
    op.create_index(
        op.f('ix_user_business_unit_id'), 'user_business_unit',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_user_business_unit_id'), table_name='user_business_unit')
    op.drop_constraint(
        'user_business_unit_unique',
        'user_business_unit',
        type_='unique'
    )
    op.drop_table('user_business_unit')
    op.execute('DROP TYPE user_business_unit_role')
