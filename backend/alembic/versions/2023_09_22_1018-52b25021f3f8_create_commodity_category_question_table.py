"""create commodity category question table

Revision ID: 52b25021f3f8
Revises: 914c0f61095e
Create Date: 2023-09-22 10:18:57.066202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '52b25021f3f8'
down_revision: Union[str, None] = '914c0f61095e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'commodity_category_question',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'commodity_category', sa.Integer(), sa.ForeignKey('commodity_category.id')),
        sa.Column('question', sa.Integer(), sa.ForeignKey('question.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['commodity_category'], ['commodity_category.id'],
            name='commodity_category_question_commodity_category_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['question'], ['question.id'],
            name='commodity_category_question_question_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'commodity_category', 'question',
            name='commodity_category_question_unique')
    )
    op.create_index(
        op.f('ix_commodity_category_question_id'), 'commodity_category_question',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_commodity_category_question_id'),
        table_name='commodity_category_question')
    op.drop_constraint(
        'commodity_category_question_unique',
        'commodity_category_question',
        type_='unique'
    )
    op.drop_table('commodity_category_question')
