"""create project tag table

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
        'project_tag',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project', sa.Integer(), sa.ForeignKey('project.id')),
        sa.Column('tag', sa.Integer(), sa.ForeignKey('tag.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['project'], ['project.id'],
            name='project_tag_project_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['tag'], ['tag.id'],
            name='project_tag_tag_constraint',
            ondelete='CASCADE'),
        sa.UniqueConstraint(
            'project', 'tag',
            name='project_tag_unique')
    )
    op.create_index(
        op.f('ix_project_tag_id'), 'project_tag',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_project_tag_id'), table_name='project_tag')
    op.drop_constraint(
        'project_tag_unique',
        'project_tag',
        type_='unique'
    )
    op.drop_table('project_tag')
