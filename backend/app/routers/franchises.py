from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Franchise, User
from app.schemas import (
    FranchiseCreate,
    FranchiseUpdate,
    Franchise as FranchiseSchema,
    FranchiseWithBranches
)
from app.auth import get_current_active_user
from app.activity_logger import log_activity

router = APIRouter(prefix="/api/franchises", tags=["Franchises"])


@router.post("", response_model=FranchiseSchema, status_code=status.HTTP_201_CREATED)
def create_franchise(
    franchise_data: FranchiseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if tax number already exists
    existing = db.query(Franchise).filter(Franchise.tax_number == franchise_data.tax_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tax number already registered"
        )
    
    db_franchise = Franchise(**franchise_data.model_dump())
    db.add(db_franchise)
    db.commit()
    db.refresh(db_franchise)
    
    # Log activity
    log_activity(
        db,
        current_user.id,
        "franchise_created",
        f"Yeni franchise eklendi: {db_franchise.name}"
    )
    
    return db_franchise


@router.get("", response_model=List[FranchiseSchema])
def get_franchises(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Franchise)
    
    if search:
        query = query.filter(
            (Franchise.name.ilike(f"%{search}%")) |
            (Franchise.tax_number.ilike(f"%{search}%"))
        )
    
    if is_active is not None:
        query = query.filter(Franchise.is_active == is_active)
    
    franchises = query.offset(skip).limit(limit).all()
    return franchises


@router.get("/{franchise_id}", response_model=FranchiseWithBranches)
def get_franchise(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franchise not found"
        )
    return franchise


@router.put("/{franchise_id}", response_model=FranchiseSchema)
def update_franchise(
    franchise_id: int,
    franchise_data: FranchiseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franchise not found"
        )
    
    # Check if new tax number conflicts with existing one
    if franchise_data.tax_number and franchise_data.tax_number != franchise.tax_number:
        existing = db.query(Franchise).filter(
            Franchise.tax_number == franchise_data.tax_number,
            Franchise.id != franchise_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tax number already in use"
            )
    
    changes = []
    update_data = franchise_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None and getattr(franchise, field) != value:
            if field == "name":
                changes.append(f"isim: {value}")
            elif field == "tax_number":
                changes.append("vergi numarası")
            elif field == "phone":
                changes.append("telefon")
            elif field == "email":
                changes.append("e-posta")
            elif field == "address":
                changes.append("adres")
        setattr(franchise, field, value)
    
    db.commit()
    db.refresh(franchise)
    
    # Log activity
    if changes:
        log_activity(
            db,
            current_user.id,
            "franchise_updated",
            f"Franchise güncellendi: {franchise.name} - {', '.join(changes)}"
        )
    
    return franchise


@router.delete("/{franchise_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_franchise(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Franchise not found"
        )
    
    franchise_name = franchise.name
    
    db.delete(franchise)
    db.commit()
    
    # Log activity
    log_activity(
        db,
        current_user.id,
        "franchise_deleted",
        f"Franchise silindi: {franchise_name}"
    )
    return None


