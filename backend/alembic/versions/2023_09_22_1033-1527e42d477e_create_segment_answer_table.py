"""create segment answer table

Revision ID: 1527e42d477e
Revises: ff56dba95c67
Create Date: 2023-09-22 10:33:07.616226

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1527e42d477e'
down_revision: Union[str, None] = 'ff56dba95c67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'segment_answer',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'case_commodity', sa.Integer(), sa.ForeignKey('case_commodity.id')),
        sa.Column('segment', sa.Integer(), sa.ForeignKey('segment.id')),
        sa.Column('question', sa.Integer(), sa.ForeignKey('question.id')),
        sa.Column('current_value', sa.Float(), nullable=False),
        sa.Column('feasible_value', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['case_commodity'], ['case_commodity.id'],
            name='segment_answer_commodity_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['segment'], ['segment.id'],
            name='segment_answer_segment_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['question'], ['question.id'],
            name='segment_answer_question_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'case_commodity', 'segment', 'question',
            name='segment_answer_case_commodity_segment_question_unique')
    )
    op.create_index(
        op.f('ix_segment_answer_id'), 'segment_answer',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_segment_answer_id'),
        table_name='segment_answer')
    op.drop_constraint(
        'segment_answer_case_commodity_segment_question_unique',
        'segment_answer',
        type_='unique'
    )
    op.drop_table('segment_answer')
