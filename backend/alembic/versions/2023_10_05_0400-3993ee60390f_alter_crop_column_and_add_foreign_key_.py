"""alter commodity column and add foreign key constraint on case table

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
    op.drop_constraint('case_commodity_fkey', 'case', type_='foreignkey')
    op.alter_column('case', 'commodity', new_column_name='focus_commodity')
    op.create_foreign_key(
        'case_focus_commodity_fkey', 'case', 'commodity',
        ['focus_commodity'], ['id']
    )


def downgrade() -> None:
    op.drop_constraint(
        'case_focus_commodity_fkey', 'case', type_='foreignkey')
    op.alter_column('case', 'focus_commodity', new_column_name='commodity')
    op.create_foreign_key(
        'case_commodity_fkey', 'case', 'commodity',
        ['commodity'], ['id']
    )
