import platform
from datetime import datetime
from typing import Annotated

import psutil
from GPUtil import GPUtil
from fastapi import Depends, APIRouter, Form

from baznimodeli import ItemOperater, ItemSifrarnik, ItemKomitent, ItemDogadjaj
from moduli.dogadjaji_modul import upis_sifrarnika, listanje_sifrarnika, upis_komitenata, lista_komitenata, \
    upis_dogadjaja, lista_dogadjaja
from ruteri.login_ruter import get_current_active_user

router = APIRouter()


@router.get("/operater/ja/", response_model=ItemOperater)
async def citaj_operater_ja(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return current_user


@router.get("/operater/ja/items/")
async def citaj_moje_ajteme(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return [{"item_id": "Mujo", "vlasnik": current_user.email}]


# SIFRARICI

@router.post("/sifrarnik/statusdogadjaja/uredi")
async def kreiraj_sifrarnik_sd(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemSifrarnik
):
    return upis_sifrarnika("DogadjajiStatusDogadjaja", podaci)


@router.post("/sifrarnik/vrstetroskova/uredi")
async def kreiraj_sifrarnik_vt(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemSifrarnik
):
    return upis_sifrarnika("DogadjajiVrsteTroskova", podaci)


@router.post("/sifrarnik/vrstedogadjaja/uredi")
async def kreiraj_sifrarnik_vd(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemSifrarnik
):
    return upis_sifrarnika("DogadjajiVrsteDogadjaja", podaci)


@router.post("/sifrarnik/vrstakomitenata/uredi")
async def kreiraj_sifrarnik_vk(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemSifrarnik
):
    return upis_sifrarnika("VrstaKomitenata", podaci)

@router.get("/sifrarnik/statusdogadjaja/lista")
async def listanje_sifrarnika_sd(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return listanje_sifrarnika("DogadjajiStatusDogadjaja")


@router.get("/sifrarnik/vrstetroskova/lista")
async def listanje_sifrarnika_vt(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return listanje_sifrarnika("DogadjajiVrsteTroskova")


@router.get("/sifrarnik/vrstakomitenata/lista")
async def listanje_sifrarnika_vk(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return listanje_sifrarnika("VrstaKomitenata")



@router.get("/sifrarnik/vrstedogadjaja/lista")
async def listanje_sifrarnika_vd(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)]
):
    return listanje_sifrarnika("DogadjajiVrsteDogadjaja")

# SIFRARICI


#KOMITENTI
@router.post("/komitent/uredi")
async def kreiraj_komitenta(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemKomitent
):
    return upis_komitenata(podaci)

@router.get("/komitent/lista/{vrsta_komitenta}")
async def listanje_komitenta(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], vrsta_komitenta: int
):
    return lista_komitenata(vrsta_komitenta)
#KOMITENTI



# DOGADJAJ

@router.post("/uredi")
async def kreiraj_dogadjaj(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemDogadjaj
):
    return upis_dogadjaja(podaci)

@router.get("/lista")
async def listanje_dogadjaja(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)],
    datumod: str = Form(...), datumdo: str = Form(...)
):
    return lista_dogadjaja(datumod, datumdo)

# DOGADJAJ