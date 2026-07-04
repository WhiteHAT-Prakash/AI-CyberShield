from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email:     EmailStr
    password:  str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    id:           int
    full_name:    str
    email:        str
    is_active:    bool
    threat_score: Optional[float] = 0.0
    created_at:   datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str
    user:         UserResponse
