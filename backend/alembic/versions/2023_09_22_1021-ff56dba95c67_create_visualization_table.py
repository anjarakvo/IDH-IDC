"""create visualization table

Revision ID: ff56dba95c67
Revises: 52b25021f3f8
Create Date: 2023-09-22 10:21:45.253839

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg


# revision identifiers, used by Alembic.
revision: str = 'ff56dba95c67'
down_revision: Union[str, None] = '52b25021f3f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'visualization',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column(
            'tabs',
            sa.Enum(
                'income_overview',
                'sensitivity_analysis',
                'scenario_modeling',
                name='visualization_tabs_enum'
            ),
            nullable=False),
        sa.Column('config', pg.JSONB()),
    )
    op.create_index(
        op.f('ix_visualization_id'), 'project', ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_visualization_id'), table_name='visualization')
    op.drop_table('visualization')
    op.execute('DROP TYPE visualization_tabs_enum')
