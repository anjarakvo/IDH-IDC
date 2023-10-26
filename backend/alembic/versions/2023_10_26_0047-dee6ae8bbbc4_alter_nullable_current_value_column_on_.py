"""alter_nullable_current_value_column_on_segment_answer_table

Revision ID: dee6ae8bbbc4
Revises: aec601de0715
Create Date: 2023-10-26 00:47:39.836094

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'dee6ae8bbbc4'
down_revision: Union[str, None] = 'aec601de0715'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("segment_answer", "current_value", nullable=True)


def downgrade() -> None:
    op.alter_column("segment_answer", "current_value", nullable=False)
