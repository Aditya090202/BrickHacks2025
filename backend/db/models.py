from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from .database import PyObjectId
from bson import ObjectId
from datetime import datetime

class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    hashed_password: str
    full_name: str
    disabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "hashed_password": "hashedpasswordstring",
                "full_name": "John Doe",
                "disabled": False
            }
        }

# This model is for user creation/response - excludes password

class UserResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    hashed_password: str
    full_name: str
    disabled: bool = False
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class CarCrashModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., description="Reference to the user who reported the crash")
    date_of_incident: datetime
    location: dict = Field(..., description="GPS coordinates or address")
    description: str
    severity: str = Field(..., description="Minor/Moderate/Severe")
    vehicles_involved: int
    injuries: bool
    police_report_number: Optional[str] = None
    insurance_claim_number: Optional[str] = None
    photos: Optional[List[str]] = None  # URLs to stored photos
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "date_of_incident": "2024-03-20T10:30:00",
                "location": {
                    "latitude": 40.7128,
                    "longitude": -74.0060,
                    "address": "123 Main St, New York, NY"
                },
                "description": "Rear-end collision at intersection",
                "severity": "Minor",
                "vehicles_involved": 2,
                "injuries": False,
                "police_report_number": "PR123456",
                "insurance_claim_number": "IC789012"
            }
        }