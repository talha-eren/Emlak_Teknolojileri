from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List


# Franchise Schemas
class FranchiseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    tax_number: str = Field(..., min_length=1, max_length=50)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True


class FranchiseCreate(FranchiseBase):
    pass


class FranchiseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    tax_number: Optional[str] = Field(None, min_length=1, max_length=50)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class Franchise(FranchiseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FranchiseWithBranches(Franchise):
    branches: List["Branch"] = []


# Branch Schemas
class BranchBase(BaseModel):
    franchise_id: int
    name: str = Field(..., min_length=1, max_length=255)
    city: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    consultant_count: Optional[int] = 0
    is_active: bool = True


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    consultant_count: Optional[int] = None
    is_active: Optional[bool] = None


class Branch(BranchBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    franchise_id: Optional[int] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6)


class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithFranchise(User):
    franchise: Optional[Franchise] = None


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Dashboard Stats Schema
class DashboardStats(BaseModel):
    total_franchises: int
    total_branches: int
    total_sales: int
    pending_requests: int


# Activity Log Schemas
class ActivityLogBase(BaseModel):
    action: str
    description: str


class ActivityLogCreate(ActivityLogBase):
    user_id: int


class ActivityLog(ActivityLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Update forward references
FranchiseWithBranches.model_rebuild()


