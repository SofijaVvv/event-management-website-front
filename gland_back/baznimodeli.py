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
    appfirme_id: Optional[int]


class ItemFirma(BaseModel):
    id: int
    naziv: Optional[str]
    pib: Optional[str]
    pdvbroj: Optional[str]
    adresa: Optional[str]
    telefon: Optional[str]
    email: Optional[str]
    ziroracun: Optional[str]
    drzava: Optional[int]
    grad: Optional[str]
    podesavanja: Optional[str]
    kodorganizacionejedinice: Optional[str]
    tcrkod: Optional[str]
    kodsoftvera: Optional[str]
    sifradjelatnosti: Optional[str]
    pib_o: Optional[str]
    ime_o: Optional[str]
    adresa_o: Optional[str]


class ItemSifrarnik(BaseModel):
    id: int
    naziv: Optional[str]


class ItemKomitent(BaseModel):
    id: int
    naziv: Optional[str]
    pib: str
    pdvbroj: str
    adresa: Optional[str]
    telefon: Optional[str]
    email: Optional[str]
    ziroracun: Optional[str]
    drzava: int
    grad: Optional[str]
    napomena: Optional[str]
    vrstakomitenta_id: Optional[int]


class ItemDogadjaj(BaseModel):
    id: int
    datum: str
    vrijeme: str
    komitent_id: int
    vrstadogadjaja_id: int
    iznos: float
    opis: str
    statusdogadjaja_id: int