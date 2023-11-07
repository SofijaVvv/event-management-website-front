from typing import Optional
from pydantic import BaseModel


class Korisnik(BaseModel):
    email: str
    lozinka: str
    otp: str


class ItemOperater(BaseModel):
    id: int
    ime: Optional[str]
    lozinka: Optional[str]
    email: Optional[str]
    kljuc: Optional[str]
    kodoperatera: Optional[str]
    admin: Optional[int]
    aktivan: Optional[int]
    telefon: Optional[str]
    brojvlasnikapodataka: Optional[int]

