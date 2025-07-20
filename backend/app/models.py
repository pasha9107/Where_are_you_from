from sqlalchemy import Column, Integer, String, Float, ForeignKey
from .database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    password = Column(String)
    last_name = Column(String)
    first_name = Column(String)
    patronymic = Column(String)

class Marker(Base):
    __tablename__ = "markers"
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    text = Column(String, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)