import calendar
from datetime import date

from sqlalchemy import exc
from sqlalchemy.orm import joinedload

from baznimodeli import ItemKomitent, ItemDogadjaj, ItemZadatak, ItemPrihodi, ItemRaspored, ItemTroskovi
from modeli import DogadjajiStatusDogadjaja, DogadjajiVrsteDogadjaja, DogadjajiVrsteTroskova, Komitent, VrstaKomitenata, \
    Dogadjaji, DogadjajiZadaci, DogadjajiPrihodi, DogadjajiRaspored, DogadjajiTroskovi
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


    try:
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
                print(tmp)
                rezultat.append(tmp)
    except exc.SQLAlchemyError as e:
        print(e)
    except Exception as e:
        print(e)
    print(rezultat)
    return rezultat


# DOGADJAJI

# ZADACI

def upis_zadataka(zadatak: ItemZadatak):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if zadatak.id > 0:
            query = db.query(DogadjajiZadaci).filter(DogadjajiZadaci.id == zadatak.id).first()
            if query:
                for kljuc, vrijednost in zadatak.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del zadatak.id
            db.add(DogadjajiZadaci(**zadatak.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_zadataka(dogadjaj_id: int):
    with get_db() as db:
        if dogadjaj_id > 0:
            return db.query(DogadjajiZadaci).filter(DogadjajiZadaci.dogadjaj_id == dogadjaj_id).all()
        return db.query(DogadjajiZadaci).all()


# ZADACI

# PRIHODI

def upis_prihoda(prihod: ItemPrihodi):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if prihod.id > 0:
            query = db.query(DogadjajiPrihodi).filter(DogadjajiPrihodi.id == prihod.id).first()
            if query:
                for kljuc, vrijednost in prihod.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del prihod.id
            db.add(DogadjajiPrihodi(**prihod.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_prihoda(dogadjaj_id: int):
    with get_db() as db:
        if dogadjaj_id > 0:
            return db.query(DogadjajiPrihodi).filter(DogadjajiPrihodi.dogadjaj_id == dogadjaj_id).all()
        return db.query(DogadjajiPrihodi).all()


# PRIHODI

# RASPORED

def upis_rasporeda(raspored: ItemRaspored):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if raspored.id > 0:
            query = db.query(DogadjajiRaspored).filter(DogadjajiRaspored.id == raspored.id).first()
            if query:
                for kljuc, vrijednost in raspored.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del raspored.id
            db.add(DogadjajiRaspored(**raspored.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_rasporeda(dogadjaj_id: int):
    with get_db() as db:
        if dogadjaj_id > 0:
            return db.query(DogadjajiRaspored).filter(DogadjajiRaspored.dogadjaj_id == dogadjaj_id).all()
        return db.query(DogadjajiRaspored).all()


# RASPORED

# TROSKOVI

def upis_troskova(trosak: ItemTroskovi):
    rezultat = {
        'greska': True,
        'poruka': 'Nije upisano'
    }
    with get_db() as db:
        if trosak.id > 0:
            query = db.query(DogadjajiTroskovi).filter(DogadjajiTroskovi.id == trosak.id).first()
            if query:
                for kljuc, vrijednost in trosak.model_dump().items():
                    setattr(query, kljuc, vrijednost)
                db.commit()
                rezultat = {
                    'greska': False,
                    'poruka': 'Uspješno ispravljen podatak'
                }
        else:
            del trosak.id
            db.add(DogadjajiTroskovi(**trosak.model_dump()))
            db.commit()
            rezultat = {
                'greska': False,
                'poruka': 'Uspješno upisan podatak'
            }
    return rezultat


def lista_troskova(dogadjaj_id: int):
    with get_db() as db:
        if dogadjaj_id > 0:
            return db.query(DogadjajiTroskovi).filter(DogadjajiTroskovi.dogadjaj_id == dogadjaj_id).all()
        return db.query(DogadjajiTroskovi).all()


# TROSKOVI


def kalendar(godina, mjesec, status=1):
    with get_db() as ms:
        year = godina
        month = mjesec

        _, num_days = calendar.monthrange(year, month)

        start_weekday, _ = calendar.monthrange(year, month)
        start_weekday = (start_weekday + 1) % 7  # Convert to 0-based index

        cal = calendar.monthcalendar(year, month)

        calendar_table = [[] for _ in range(6)]

        for week_index, week in enumerate(cal):
            for day in week:
                if 1 <= day <= num_days:
                    entries = ms.query(Dogadjaji).filter(Dogadjaji.datum == date(year, month, day)). \
                        filter(Dogadjaji.statusdogadjaja_id == status).all()
                    if entries:
                        calendar_table[week_index].append(
                            {"datum": day, "brojdogadjaja": len(entries), "danunedjelji": date(year, month, day).weekday()})
                    else:
                        calendar_table[week_index].append(
                            {"datum": day, "brojdogadjaja": 0, "danunedjelji": date(year, month, day).weekday()})
                else:
                    calendar_table[week_index].append({})
        ms.close()
        calendar_data = {"tabela": calendar_table[:-1]}
        return calendar_data
