from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Franchise, Branch, User, ActivityLog
from app.schemas import DashboardStats, ActivityLog as ActivityLogSchema
from app.auth import get_current_active_user
from typing import List

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get actual counts from database
    total_franchises = db.query(func.count(Franchise.id)).scalar()
    total_branches = db.query(func.count(Branch.id)).scalar()
    
    # Calculate total consultants from all branches
    total_consultants = db.query(func.sum(Branch.consultant_count)).scalar() or 0
    
    # Count inactive branches as pending requests
    pending_requests = db.query(func.count(Branch.id)).filter(Branch.is_active == False).scalar() or 0
    
    return {
        "total_franchises": total_franchises or 0,
        "total_branches": total_consultants,  # Show total consultants instead
        "total_sales": 500000,  # Keep mock for now
        "pending_requests": pending_requests
    }


@router.get("/activities", response_model=List[ActivityLogSchema])
def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    activities = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all()
    return activities


