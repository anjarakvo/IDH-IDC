"""alter commodity column and add foreign key constraint on project table

Revision ID: 3993ee60390f
Revises: 4acf424dcf01
Create Date: 2023-10-05 04:00:41.405990

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '3993ee60390f'
down_revision: Union[str, None] = '4acf424dcf01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('project_commodity_fkey', 'project', type_='foreignkey')
    op.alter_column('project', 'commodity', new_column_name='focus_commodity')
    op.create_foreign_key(
        'project_focus_commodity_fkey', 'project', 'commodity',
        ['focus_commodity'], ['id']
    )


def downgrade() -> None:
    op.drop_constraint(
        'project_focus_commodity_fkey', 'project', type_='foreignkey')
    op.alter_column('project', 'focus_commodity', new_column_name='commodity')
    op.create_foreign_key(
        'project_commodity_fkey', 'project', 'commodity',
        ['commodity'], ['id']
    )
