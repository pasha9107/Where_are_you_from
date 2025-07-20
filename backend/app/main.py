from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, markers

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth, prefix="/auth")
app.include_router(markers, prefix="/markers")