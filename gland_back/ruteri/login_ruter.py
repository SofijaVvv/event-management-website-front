from datetime import datetime, timedelta
from typing import Union, Annotated

import pytz
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from starlette import status

from baznimodeli import ItemOperater
from db import get_db
from modeli import AppOperateri
from podesavanja import TAJNI_KLJUC, JWT_TRAJANJE_TOKENA

router = APIRouter()
ALGORITHM = "HS256"


class Token(BaseModel):
    token: str
    tip_tokena: str


class TokenPodaci(BaseModel):
    email: Union[str, None] = None


class OperaterUBazi(ItemOperater):
    lozinka: str


# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verifikuj_lozinku(obicna_lozinka, lozinka):
    return pwd_context.verify(obicna_lozinka, lozinka)


def uzmi_operatera(korisnicko_ime: str):
    with get_db() as db:
        operater = db.query(AppOperateri) \
            .filter(AppOperateri.email == korisnicko_ime) \
            .first()
        if not operater:
            return None
        return OperaterUBazi(**operater.to_json())


def autentifikuj_operatera(korisnicko_ime: str, password: str):
    user = uzmi_operatera(korisnicko_ime)
    if not user:
        return False
    if not verifikuj_lozinku(password, user.lozinka):
        return False
    return user


def kreiraj_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        now = pytz.timezone('Europe/Podgorica').localize(datetime.now())
        expire = now + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, TAJNI_KLJUC, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Ne mogu verifikovati korisnika",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, TAJNI_KLJUC, algorithms=[ALGORITHM])
        korisnicko_ime: str = payload.get("sub")
        if korisnicko_ime is None:
            raise credentials_exception
        token_data = TokenPodaci(email=korisnicko_ime)
    except JWTError:
        raise credentials_exception
    user = uzmi_operatera(korisnicko_ime=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[ItemOperater, Depends(get_current_user)]
):
    if current_user.aktivan == 0:
        raise HTTPException(status_code=400, detail="Neaktivan korisnik")
    return current_user


@router.post("/token")
async def login_za_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    print("form_data", form_data.client_secret)
    user = autentifikuj_operatera(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Neispravno korisničko ime ili lozinka",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=JWT_TRAJANJE_TOKENA)

    access_token = kreiraj_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print("user", user.email, "token", access_token)
    return {"token": access_token, "tip_tokena": "bearer", "user": user}


@router.get("/users/me/", response_model=ItemOperater)
async def read_users_me(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return current_user
