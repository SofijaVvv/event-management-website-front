import platform
from datetime import datetime
from typing import Annotated

import psutil
from GPUtil import GPUtil
from fastapi import Depends, APIRouter, Form

from baznimodeli import ItemOperater, ItemSifrarnik, ItemKomitent, ItemDogadjaj, ItemZadatak, ItemPrihodi, ItemRaspored, \
    ItemTroskovi
from moduli.dogadjaji_modul import upis_sifrarnika, listanje_sifrarnika, upis_komitenata, lista_komitenata, \
    upis_dogadjaja, lista_dogadjaja, upis_zadataka, lista_zadataka, upis_prihoda, lista_prihoda, upis_rasporeda, \
    lista_rasporeda, lista_troskova, upis_troskova, kalendar
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


#ZADACI

@router.post("/zadatak/uredi")
async def kreiraj_zadatak(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemZadatak
):
    return upis_zadataka(podaci)


@router.get("/zadatak/lista/{dogadjaj_id}")
async def listanje_zadataka(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], dogadjaj_id: int
):
    return lista_zadataka(dogadjaj_id)

# ZADACI

# PRIHODI

@router.post("/prihodi/uredi")
async def kreiraj_prihod(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemPrihodi
):
    return upis_prihoda(podaci)

@router.get("/prihodi/lista/{dogadjaj_id}")
async def listanje_prihoda(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], dogadjaj_id: int
):
    return lista_prihoda(dogadjaj_id)


# PRIHODI

# RASPORED

@router.post("/raspored/uredi")
async def kreiraj_raspored(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemRaspored
):
    return upis_rasporeda(podaci)

@router.get("/raspored/lista/{dogadjaj_id}")
async def listanje_rasporeda(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], dogadjaj_id: int
):
    return lista_rasporeda(dogadjaj_id)


# TROSKOVI

@router.post("/troskovi/uredi")
async def kreiraj_trosak(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], podaci: ItemTroskovi
):
    return upis_troskova(podaci)


@router.get("/troskovi/lista/{dogadjaj_id}")
async def listanje_troskova(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], dogadjaj_id: int
):
    return lista_troskova(dogadjaj_id)


@router.get("/kalendar/{mjesec}/{godina}")
async def kreirajkalendar(
    current_user: Annotated[ItemOperater, Depends(get_current_active_user)], mjesec: int, godina: int
):
    return kalendar(godina, mjesec)