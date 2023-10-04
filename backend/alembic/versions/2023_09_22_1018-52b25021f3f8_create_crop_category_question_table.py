"""create crop category question table

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
        'crop_category_question',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'crop_category', sa.Integer(), sa.ForeignKey('crop_category.id')),
        sa.Column('question', sa.Integer(), sa.ForeignKey('question.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['crop_category'], ['crop_category.id'],
            name='crop_category_question_crop_category_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['question'], ['question.id'],
            name='crop_category_question_question_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'crop_category', 'question',
            name='crop_category_question_unique')
    )
    op.create_index(
        op.f('ix_crop_category_question_id'), 'crop_category_question',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_crop_category_question_id'),
        table_name='crop_category_question')
    op.drop_constraint(
        'crop_category_question_unique',
        'crop_category_question',
        type_='unique'
    )
    op.drop_table('crop_category_question')
