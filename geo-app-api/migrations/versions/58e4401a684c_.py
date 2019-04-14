"""Initial migration

Revision ID: 58e4401a684c
Revises:
Create Date: 2019-04-14 21:34:49.069615

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '58e4401a684c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('service',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('service_name', sa.String(length=255), nullable=True),
    sa.Column('contact_name', sa.String(length=255), nullable=True),
    sa.Column('contact_email', sa.String(length=255), nullable=True),
    sa.Column('city', sa.String(length=255), nullable=True),
    sa.Column('available_help', sa.String(length=255), nullable=True),
    sa.Column('telephone', sa.String(length=255), nullable=True),
    sa.Column('attention_capacity', sa.String(length=512), nullable=True),
    sa.Column('jobs', sa.String(length=1024), nullable=True),
    sa.Column('infrastructure_type', sa.String(length=255), nullable=True),
    sa.Column('description', sa.String(length=1024), nullable=True),
    sa.Column('address', sa.String(length=1024), nullable=True),
    sa.Column('available_via_internet', sa.Boolean(), nullable=True),
    sa.Column('services_avialable_for', sa.String(length=512), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('category', sa.String(length=512), nullable=True),
    sa.Column('promote', sa.Boolean(), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('service')
    # ### end Alembic commands ###
