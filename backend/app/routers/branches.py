from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Branch, Franchise, User
from app.schemas import (
    BranchCreate,
    BranchUpdate,
    Branch as BranchSchema
)
from app.auth import get_current_active_user
from app.activity_logger import log_activity

router = APIRouter(prefix="/api", tags=["Branches"])


@router.post("/branches", response_model=BranchSchema, status_code=status.HTTP_201_CREATED)
def create_branch(
    branch_data: BranchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if franchise exists
    franchise = db.query(Franchise).filter(Franchise.id == branch_data.franchise_id).first()
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franchise not found"
        )
    
    db_branch = Branch(**branch_data.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    
    # Log activity
    log_activity(
        db,
        current_user.id,
        "branch_created",
        f"Yeni ofis eklendi: {db_branch.name} ({db_branch.city})"
    )
    
    return db_branch


@router.get("/branches", response_model=List[BranchSchema])
def get_all_branches(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Branch)
    
    if search:
        query = query.filter(
            (Branch.name.ilike(f"%{search}%")) |
            (Branch.city.ilike(f"%{search}%"))
        )
    
    branches = query.offset(skip).limit(limit).all()
    return branches


@router.get("/franchises/{franchise_id}/branches", response_model=List[BranchSchema])
def get_franchise_branches(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if franchise exists
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franchise not found"
        )
    
    branches = db.query(Branch).filter(Branch.franchise_id == franchise_id).all()
    return branches


@router.get("/branches/{branch_id}", response_model=BranchSchema)
def get_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found"
        )
    return branch


@router.put("/branches/{branch_id}", response_model=BranchSchema)
def update_branch(
    branch_id: int,
    branch_data: BranchUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found"
        )
    
    changes = []
    update_data = branch_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None and getattr(branch, field) != value:
            if field == "consultant_count":
                changes.append(f"danışman sayısı: {value}")
            elif field == "name":
                changes.append(f"isim: {value}")
            elif field == "city":
                changes.append(f"şehir: {value}")
        setattr(branch, field, value)
    
    db.commit()
    db.refresh(branch)
    
    # Log activity
    if changes:
        log_activity(
            db,
            current_user.id,
            "branch_updated",
            f"Ofis güncellendi: {branch.name} - {', '.join(changes)}"
        )
    
    return branch


@router.delete("/branches/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found"
        )
    
    branch_name = branch.name
    
    db.delete(branch)
    db.commit()
    
    # Log activity
    log_activity(
        db,
        current_user.id,
        "branch_deleted",
        f"Ofis silindi: {branch_name}"
    )
    
    return None


