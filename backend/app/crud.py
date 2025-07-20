from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_student_by_login(db: Session, login: str):
    return db.query(models.Student).filter(models.Student.login == login).first()

def create_student(db: Session, student: schemas.StudentCreate):
    hashed_password = pwd_context.hash(student.password)
    db_student = models.Student(
        login=student.login,
        password=hashed_password,
        last_name=student.last_name,
        first_name=student.first_name,
        patronymic=student.patronymic
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def authenticate_student(db: Session, login: str, password: str):
    student = get_student_by_login(db, login)
    if not student or not pwd_context.verify(password, student.password):
        return None
    return student

def create_marker(db: Session, marker: schemas.MarkerCreate, student_id: int):
    db_marker = models.Marker(**marker.dict(), student_id=student_id)
    db.add(db_marker)
    db.commit()
    db.refresh(db_marker)
    return db_marker

def get_markers(db: Session):
    return db.query(models.Marker).all()

def get_student_markers(db: Session, student_id: int):
    return db.query(models.Marker).filter(models.Marker.student_id == student_id).all()

def delete_marker(db: Session, marker_id: int, student_id: int):
    marker = db.query(models.Marker).filter(
        models.Marker.id == marker_id,
        models.Marker.student_id == student_id
    ).first()
    if marker:
        db.delete(marker)
        db.commit()
    return marker