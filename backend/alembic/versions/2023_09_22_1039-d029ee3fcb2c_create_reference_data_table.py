"""create reference data table

Revision ID: d029ee3fcb2c
Revises: cf8d0e0da651
Create Date: 2023-09-22 10:39:56.896472

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd029ee3fcb2c'
down_revision: Union[str, None] = 'cf8d0e0da651'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'reference_data',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('commodity', sa.Integer(), sa.ForeignKey('commodity.id')),
        sa.Column(
            'type',
            sa.Enum(
                'baseline_average',
                'segment_average',
                name='reference_data_type'
            )),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column(
            'farm_size', sa.Float(), nullable=True,
            comment='The Farm Land Size in Hectare'),
        sa.Column(
            'farmer_production', sa.Float(), nullable=True,
            comment='Farmer Production in KG'),
        sa.Column(
            'farmgate_price', sa.Float(), nullable=True,
            comment='Farm Gate Price USD / KG'),
        sa.Column(
            'farmer_expenses', sa.Float(), nullable=True,
            comment='Cost of Production in USD'),
        sa.Column(
            'diversified_income', sa.Float(), nullable=True,
            comment='Secondary or Tertiary Income'),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['country'], ['country.id'],
            name='reference_data_country_constraint',
            ondelete='CASCADE'),
        sa.ForeignKeyConstraint(
            ['commodity'], ['commodity.id'],
            name='reference_data_commodity_constraint',
            ondelete='CASCADE'),
    )
    op.create_index(
        op.f('ix_reference_data_id'), 'reference_data',
        ['id'], unique=True)


def downgrade() -> None:
    op.drop_index(
        op.f('ix_reference_data_id'),
        table_name='reference_data')
    op.drop_table('reference_data')
    op.execute('DROP TYPE reference_data_type')
