"""create case tag table

Revision ID: 4acf424dcf01
Revises: d029ee3fcb2c
Create Date: 2023-09-29 07:37:53.414380

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4acf424dcf01'
down_revision: Union[str, None] = 'd029ee3fcb2c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'case_tag',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('case', sa.Integer(), sa.ForeignKey('case.id')),
        sa.Column('tag', sa.Integer(), sa.ForeignKey('tag.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['case'], ['case.id'],
            name='case_tag_case_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['tag'], ['tag.id'],
            name='case_tag_tag_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'case', 'tag',
            name='case_tag_unique')
    )
    op.create_index(
        op.f('ix_case_tag_id'), 'case_tag',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_case_tag_id'), table_name='case_tag')
    op.drop_constraint(
        'case_tag_unique',
        'case_tag',
        type_='unique'
    )
    op.drop_table('case_tag')
