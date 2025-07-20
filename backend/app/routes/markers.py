from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from ..auth.jwt import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.Marker)
def create_marker(marker: schemas.MarkerCreate, db: Session = Depends(database.SessionLocal), current_user: dict = Depends(get_current_user)):
    return crud.create_marker(db, marker, current_user.id)

@router.get("/", response_model=list[schemas.Marker])
def get_all(db: Session = Depends(database.SessionLocal)):
    return crud.get_markers(db)

@router.get("/my", response_model=list[schemas.Marker])
def get_my_markers(
    current_user: schemas.Student = Depends(get_current_user),
    db: Session = Depends(database.SessionLocal)
):
    return crud.get_student_markers(db, current_user.id)

@router.delete("/{marker_id}")
def delete_marker(
    marker_id: int,
    current_user: schemas.Student = Depends(get_current_user),
    db: Session = Depends(database.SessionLocal)
):
    marker = crud.delete_marker(db, marker_id, current_user.id)
    if not marker:
        raise HTTPException(status_code=404, detail="Метка не найдена или не принадлежит вам")
    return {"message": "Метка удалена"}