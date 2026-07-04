from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Boolean
from sqlalchemy.sql import func

from database.postgres import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String,
        unique=True,
        nullable=False,
    )

    full_name = Column(String)

    password = Column(String)

    credits = Column(
        Integer,
        default=0,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )


class Application(Base):

    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer)

    company = Column(String)

    role = Column(String)

    status = Column(String)

    applied_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
