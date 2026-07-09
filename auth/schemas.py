from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import EmailStr
from pydantic import Field


class SignupRequest(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


class LoginRequest(BaseModel):
    email: EmailStr

    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: int

    full_name: str

    email: EmailStr

    credits: int

    email_verified: bool

    is_active: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


class TokenResponse(BaseModel):
    access_token: str

    refresh_token: str

    token_type: str = "bearer"

    user: UserResponse


class MessageResponse(BaseModel):
    message: str
