import json

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    orm,
    text, DateTime, INTEGER,
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:BsoBsgAkcz1969@localhost/mareza?charset=utf8"

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


class AppSesija(Base):
    __tablename__ = 'app_sesija'

    id = Column(Integer, primary_key=True)
    pristupni_token = Column(String(150))
    datum_kreiranja = Column(DateTime)
    datum_isteka = Column(DateTime)
    operater_id = Column(Integer)


def otvoribazu():
    ms = orm.Session(bind=engine)
    return ms

# Base.metadata.create_all(engine)
# upisi_default()

# ms = otvoribazu()
# rezultati = ms.query(AppOperateri).all()
# print(rezultati)
# ms.close()
