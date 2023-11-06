
# CREATE TABLE drzave
# (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     sifravalute INT(11),
#     opisvalute VARCHAR(3),
#     drzava_skraceno_2 VARCHAR(2),
#     drzava_skraceno_3 VARCHAR(3),
#     drzava VARCHAR(50),
#     drazavaeng VARCHAR(50),
#     paritet INT(11),
#     issepa INT(11)
#
#
# );

CREATE TABLE vrsta_komitenta
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(250)

);

CREATE TABLE komitent
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(250),
    pib VARCHAR(15),
    pdvbroj VARCHAR(15),
    adresa VARCHAR(250),
    telefon VARCHAR(250),
    email VARCHAR(250),
    ziroracun VARCHAR(250),
    drzava_id INT(11),
    grad VARCHAR(200),
    napomena VARCHAR(250),
    vrsta_komitenta_id INT(11),
    FOREIGN KEY (drzava_id) REFERENCES drzave(id),
    FOREIGN KEY (vrsta_komitenta_id) REFERENCES vrsta_komitenta(id)



);








CREATE TABLE dogadjaji_status_dogadjaja
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(250)

);

CREATE TABLE dogadjaji_vrste
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(250)

);

CREATE TABLE dogadjaji
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    datum DATE,
    vrijeme TIME,
    komitent_id INT(11),
    dogadjaji_vrste_id INT(11),
    iznos DECIMAL(10,2),
    opis text,
    dogadjaji_status_dogadjaja_id INT(11),
    FOREIGN KEY (komitent_id) REFERENCES komitent(id),
    FOREIGN KEY (dogadjaji_vrste_id) REFERENCES dogadjaji_vrste(id),
    FOREIGN KEY (dogadjaji_status_dogadjaja_id) REFERENCES dogadjaji_status_dogadjaja(id)

);

CREATE TABLE dogadjaji_vrste_troskova
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    naziv VARCHAR(250)

);

CREATE TABLE dogadjaji_troskovi
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    dogadjaji_id INT(11),
    datum DATETIME,
    dogadjaji_vrste_troskova_id INT(11),
    iznos DECIMAL(10,2),
    opis text,
    FOREIGN KEY (dogadjaji_id) REFERENCES dogadjaji(id),
    FOREIGN KEY (dogadjaji_vrste_troskova_id) REFERENCES dogadjaji_vrste_troskova(id)

);

CREATE TABLE dogadjaji_raspored
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    dogadjaji_id INT(11),
    datum DATETIME,
    opis text,
    FOREIGN KEY (dogadjaji_id) REFERENCES dogadjaji(id)

);

CREATE TABLE dogadjaji_zadaci
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    dogadjaji_id INT(11),
    datum DATETIME,
    opis text,
    FOREIGN KEY (dogadjaji_id) REFERENCES dogadjaji(id)

);

CREATE TABLE dogadjaji_prihodi
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    dogadjaji_id INT(11),
    iznos DECIMAL(10,2),
    datum DATETIME,
    opis text,
    FOREIGN KEY (dogadjaji_id) REFERENCES dogadjaji(id)

);

create table app_firme
(
    id                       int auto_increment
        primary key,
    naziv                    varchar(250) null,
    pib                      varchar(15)  null,
    pdvbroj                  varchar(15)  null,
    adresa                   longtext     null,
    telefon                  longtext     null,
    email                    longtext     null,
    ziroracun                longtext     null,
    drzava                   int          null,
    grad                     varchar(200) null,
    podesavanja              longtext     null,
    kodorganizacionejedinice varchar(10)  not null,
    tcrkod                   varchar(10)  not null,
    kodsoftvera              varchar(10)  not null,
    sifradjelatnosti         varchar(10)  null,
    pib_o                    varchar(15)  null,
    ime_o                    varchar(100) null,
    adresa_o                 varchar(100) null
);

create table app_operateri
(
    id                   int auto_increment
        primary key,
    app_firme_id         int          null,
    ime                  varchar(100) null,
    lozinka              varchar(200) null,
    email                varchar(200) null,
    kljuc                varchar(32)  not null,
    kodoperatera         varchar(10)  not null,
    admin                int          null,
    aktivan              int          null,
    telefon              varchar(200) null,
    FOREIGN KEY (app_firme_id) REFERENCES app_firme (id)
);
