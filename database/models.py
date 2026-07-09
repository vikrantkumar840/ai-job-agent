from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.sql import func

from database.postgres import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash = Column(
        String,
        nullable=False,
    )

    provider = Column(
        String,
        default="local",
    )

    google_id = Column(
        String,
        nullable=True,
    )

    avatar = Column(
        String,
        nullable=True,
    )

    credits = Column(
        Integer,
        default=5,
    )

    email_verified = Column(
        Boolean,
        default=False,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    is_admin = Column(
        Boolean,
        default=False,
    )

    last_login = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    token = Column(
        String,
        unique=True,
        nullable=False,
    )

    expires_at = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    revoked = Column(
        Boolean,
        default=False,
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
