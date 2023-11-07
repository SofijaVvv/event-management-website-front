from sqlalchemy.orm import joinedload

from baznimodeli import ItemKomitent, ItemDogadjaj
from modeli import DogadjajiStatusDogadjaja, DogadjajiVrsteDogadjaja, DogadjajiVrsteTroskova, Komitent, VrstaKomitenata, \
    Dogadjaji
from db import get_db


# SIFRARNICI
def upis_sifrarnika(naziv_tabele: str, podaci):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        print(naziv_tabele, podaci)
        klasa = globals()[naziv_tabele]
        if podaci.id != 0:
            query = db.query(klasa).filter(klasa.id == podaci.id).first()
            if query:
                query.naziv = podaci.naziv
                db.commit()
                rezultat['greska'] = False
                rezultat['poruka'] = 'Uspješno ispravljen podatak'
        else:
            del podaci.id
            db.add(klasa(**podaci.model_dump()))
            db.commit()
            rezultat['greska'] = False
            rezultat['poruka'] = 'Uspješno upisan podatak'
    return rezultat


def listanje_sifrarnika(naziv_tabele: str):
    with get_db() as db:
        klasa = globals()[naziv_tabele]
        return db.query(klasa).all()


# SIFRARNICI


# KOMITENTI
def upis_komitenata(podaci: ItemKomitent):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if podaci.id > 0:
            query = db.query(Komitent).filter(Komitent.id == podaci.id).first()
            if query:
                for kljuc, vrijednost in podaci.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del podaci.id
            db.add(Komitent(**podaci.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_komitenata(vrsta_komitenta: int):
    with get_db() as db:
        if vrsta_komitenta > 0:
            return db.query(Komitent).filter(Komitent.vrstakomitenta_id == vrsta_komitenta).all()
        return db.query(Komitent).all()


# KOMITENTI


# DOGADJAJI

def upis_dogadjaja(podaci: ItemDogadjaj):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if podaci.id > 0:
            query = db.query(Dogadjaji).filter(Dogadjaji.id == podaci.id).first()
            if query:
                for kljuc, vrijednost in podaci.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del podaci.id
            db.add(Dogadjaji(**podaci.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_dogadjaja(datumod: str, datumdo: str):
    rezultat = []
    if '.' in datumod:
        day, month, year = datumod.split('.')
        datumod = f"{year}-{month}-{day}"
    if '.' in datumdo:
        day, month, year = datumdo.split('.')
        datumdo = f"{year}-{month}-{day}"
    with get_db() as db:
        # db_book = db.query(Knjige).options(joinedload(Knjige.autori), joinedload(Knjige.vrsta_knjige)).all()

        upit = db.query(Dogadjaji, DogadjajiStatusDogadjaja.naziv.label('status'),
                        DogadjajiVrsteDogadjaja.naziv.label('vrstadogadjaja'),
                        Komitent.naziv.label('komitent')) \
            .join(DogadjajiStatusDogadjaja, Dogadjaji.statusdogadjaja_id == DogadjajiStatusDogadjaja.id) \
            .join(DogadjajiVrsteDogadjaja, Dogadjaji.vrstadogadjaja_id == DogadjajiVrsteDogadjaja.id) \
            .join(Komitent, Dogadjaji.komitent_id == Komitent.id) \
            .filter(Dogadjaji.datum >= datumod, Dogadjaji.datum <= datumdo).all()
        for dogadjaj in upit:
            tmp = dogadjaj[0].to_json()
            tmp['status'] = dogadjaj[1]
            tmp['vrstadogadjaja'] = dogadjaj[2]
            tmp['komitent'] = dogadjaj[3]
            rezultat.append(tmp)
    return rezultat

