from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentCreate(BaseModel):
    login: str
    password: str
    last_name: str
    first_name: str
    patronymic: str

class Student(BaseModel):
    id: int
    login: str
    last_name: str
    first_name: str
    patronymic: str

    class Config:
        from_attributes = True 

class MarkerBase(BaseModel):
    latitude: float
    longitude: float
    text: str

class MarkerCreate(MarkerBase):
    pass

class Marker(MarkerBase):
    id: int
    student_id: int

    class Config:
        from_attributes = True 