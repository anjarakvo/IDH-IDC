"""create question table

Revision ID: 914c0f61095e
Revises: d1e1af222dff
Create Date: 2023-09-22 10:14:58.166031

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import func
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "914c0f61095e"
down_revision: Union[str, None] = "d1e1af222dff"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "question",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("parent", sa.Integer(), nullable=True),
        sa.Column(
            "question_type",
            sa.Enum(
                "aggregator",
                "question",
                "diversified",
                name="question_type",
            ),
            nullable=False,
        ),
        sa.Column("code", sa.String(), nullable=True),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("default_value", sa.String(), nullable=True),
        sa.Column("created_by", sa.Integer(), sa.ForeignKey("user.id")),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=func.now(),
            onupdate=func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["user.id"],
            name="question_created_by_constraint",
            ondelete="CASCADE",
        ),
    )
    op.create_foreign_key(None, "question", "question", ["parent"], ["id"])
    op.create_index(op.f("ix_question_id"), "question", ["id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_question_id"), table_name="question")
    op.drop_table("question")
    op.execute("DROP TYPE question_type")
