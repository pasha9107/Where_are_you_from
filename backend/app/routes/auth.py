from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from ..auth.jwt import create_access_token, verify_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.SessionLocal)):
    payload = verify_token(token)
    login = payload.get("sub")
    if not login:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Недействительный токен")
    student = crud.get_student_by_login(db, login)
    if not student:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден")
    return student

@router.post("/register", response_model=schemas.Student)
def register(student: schemas.StudentCreate, db: Session = Depends(database.SessionLocal)):
    db_student = crud.get_student_by_login(db, student.login)
    if db_student:
        raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")
    return crud.create_student(db, student)

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.StudentCreate, db: Session = Depends(database.SessionLocal)):
    user = crud.authenticate_student(db, data.login, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    access_token = create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}