from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    orm,
    DateTime, DECIMAL, Text, Date, Time,
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship

SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/gland?charset=utf8"

Base = declarative_base()

engine = create_engine(SQLALCHEMY_DATABASE_URI)


class AppFirme(Base):
    __tablename__ = 'app_firme'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250))
    pib = Column(String(15))
    pdvbroj = Column(String(15))
    adresa = Column(LONGTEXT)
    telefon = Column(LONGTEXT)
    email = Column(LONGTEXT)
    ziroracun = Column(LONGTEXT)
    drzava = Column(Integer)
    grad = Column(String(200))
    podesavanja = Column(LONGTEXT)
    kodorganizacionejedinice = Column(String(10), nullable=False)
    tcrkod = Column(String(10), nullable=False)
    kodsoftvera = Column(String(10), nullable=False)
    sifradjelatnosti = Column(String(10))
    pib_o = Column(String(15))
    ime_o = Column(String(100))
    adresa_o = Column(String(100))

    def to_json(self):
        return {
            "id": self.id,
            "naziv": self.naziv,
            "pib": self.pib,
            "pdvbroj": self.pdvbroj,
            "adresa": self.adresa,
            "telefon": self.telefon,
            "email": self.email,
            "ziroracun": self.ziroracun,
            "drzava": self.drzava,
            "grad": self.grad,
            "sifradjelatnosti": self.sifradjelatnosti,
            "pib_o": self.pib_o,
            "ime_o": self.ime_o,
            "adresa_o": self.adresa_o,
        }


class AppOperateri(Base):
    __tablename__ = 'app_operateri'

    id = Column(Integer, primary_key=True)
    ime = Column(String(100))
    lozinka = Column(String(200))
    email = Column(String(200))
    kljuc = Column(String(32), nullable=False)
    kodoperatera = Column(String(10), nullable=False)
    admin = Column(Integer)
    aktivan = Column(Integer)
    telefon = Column(String(200))
    appfirme_id = Column(Integer, ForeignKey('app_firme.id'))

    def to_json(self):
        return {
            "id": self.id,
            "ime": self.ime,
            "email": self.email,
            "lozinka": self.lozinka,
            "kljuc": self.kljuc,
            "admin": self.admin,
            "aktivan": self.aktivan,
            "telefon": self.telefon,
            "kodoperatera": self.kodoperatera,
            "appfirme_id": self.appfirme_id
        }


class DogadjajiStatusDogadjaja(Base):
    __tablename__ = 'dogadjaji_status_dogadjaja'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250, 'utf8mb4_bin'))


class DogadjajiVrsteDogadjaja(Base):
    __tablename__ = 'dogadjaji_vrste'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250, 'utf8mb4_bin'))


class DogadjajiVrsteTroskova(Base):
    __tablename__ = 'dogadjaji_vrste_troskova'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250, 'utf8mb4_bin'))


class Drzave(Base):
    __tablename__ = 'drzave'

    id = Column(Integer, primary_key=True)
    sifravalute = Column(Integer, nullable=False)
    opisvalute = Column(String(3, 'utf8mb4_bin'), nullable=False)
    drzava_skraceno_2 = Column(String(2, 'utf8mb4_bin'), nullable=False)
    drzava_skraceno_3 = Column(String(3, 'utf8mb4_bin'), nullable=False)
    drzava = Column(String(50, 'utf8mb4_bin'), nullable=False)
    drzavaeng = Column(String(50, 'utf8mb4_bin'), nullable=False)
    paritet = Column(Integer, nullable=False)
    issepa = Column(Integer, nullable=False)


class VrstaKomitenata(Base):
    __tablename__ = 'vrsta_komitenata'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250, 'utf8mb4_bin'))


class Komitent(Base):
    __tablename__ = 'komitent'

    id = Column(Integer, primary_key=True)
    naziv = Column(String(250, 'utf8mb4_bin'))
    pib = Column(String(15, 'utf8mb4_bin'))
    pdvbroj = Column(String(15, 'utf8mb4_bin'))
    adresa = Column(String(250, 'utf8mb4_bin'))
    telefon = Column(String(250, 'utf8mb4_bin'))
    email = Column(String(250, 'utf8mb4_bin'))
    ziroracun = Column(String(250, 'utf8mb4_bin'))
    drzava = Column(ForeignKey('drzave.id'), index=True)
    grad = Column(String(200, 'utf8mb4_bin'))
    napomena = Column(String(250, 'utf8mb4_bin'))
    vrstakomitenta_id = Column(ForeignKey('vrsta_komitenata.id'), index=True)

    drzave = relationship('Drzave')
    vrstakomitenta = relationship('VrstaKomitenata')


class Dogadjaji(Base):
    __tablename__ = 'dogadjaji'

    id = Column(Integer, primary_key=True)
    datum = Column(Date)
    vrijeme = Column(Time)
    komitent_id = Column(ForeignKey('komitent.id'), index=True)
    vrstadogadjaja_id = Column(ForeignKey('dogadjaji_vrste.id'), index=True)
    iznos = Column(DECIMAL(10, 2))
    opis = Column(Text(collation='utf8mb4_bin'))
    statusdogadjaja_id = Column(ForeignKey('dogadjaji_status_dogadjaja.id'), index=True)
    komitent = relationship('Komitent')
    statusdogadjaja = relationship('DogadjajiStatusDogadjaja')
    vrstadogadjaja = relationship('DogadjajiVrsteDogadjaja')

    def to_json(self):
        return {
            "id": self.id,
            "datum": self.datum.strftime("%d.%m.%Y"),
            "vrijeme": self.vrijeme,
            "komitent_id": self.komitent_id,
            "vrstadogadjaja_id": self.vrstadogadjaja_id,
            "iznos": self.iznos,
            "opis": self.opis,
            "statusdogadjaja_id": self.statusdogadjaja_id
        }
class DogadjajiTroskovi(Base):
    __tablename__ = 'dogadjaji_troskovi'

    id = Column(Integer, primary_key=True)
    dogadjaj_id = Column(ForeignKey('dogadjaji.id'), index=True)
    datum = Column(DateTime)
    vrstatroska_id = Column(ForeignKey('dogadjaji_vrste_troskova.id'), index=True)
    iznos = Column(DECIMAL(10, 2))
    opis = Column(Text(collation='utf8mb4_bin'))
    komitent_id = Column(ForeignKey('komitent.id'), index=True)

    dogadjaj = relationship('Dogadjaji')
    komitent = relationship('Komitent')
    vrstatroska = relationship('DogadjajiVrsteTroskova')
class DogadjajiRaspored(Base):
    __tablename__ = 'dogadjaji_raspored'

    id = Column(Integer, primary_key=True)
    dogadjaj_id = Column(ForeignKey('dogadjaji.id'), index=True)
    datum = Column(DateTime)
    opis = Column(Text(collation='utf8mb4_bin'))

    dogadjaj = relationship('Dogadjaji')

class DogadjajiPrihodi(Base):
    __tablename__ = 'dogadjaji_prihodi'

    id = Column(Integer, primary_key=True)
    dogadjaj_id = Column(ForeignKey('dogadjaji.id'), index=True)
    iznos = Column(DECIMAL(10, 2))
    datum = Column(DateTime)
    opis = Column(Text(collation='utf8mb4_bin'))

    dogadjaj = relationship('Dogadjaji')


class DogadjajiZadaci(Base):
    __tablename__ = 'dogadjaji_zadaci'

    id = Column(Integer, primary_key=True)
    dogadjaj_id = Column(ForeignKey('dogadjaji.id'), index=True)
    datum = Column(DateTime)
    opis = Column(Text(collation='utf8mb4_bin'))
    status = Column(Integer)
    dogadjaj = relationship('Dogadjaji')


def otvoribazu():
    ms = orm.Session(bind=engine)
    return ms

# Base.metadata.create_all(engine)
# upisi_default()

# ms = otvoribazu()
# rezultati = ms.query(AppOperateri).all()
# print(rezultati)
# ms.close()
