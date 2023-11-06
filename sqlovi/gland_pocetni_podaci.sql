# pocetni inserti

INSERT INTO vrsta_komitenta ( naziv) VALUES ('Klijent fizičko lice');
INSERT INTO vrsta_komitenta ( naziv) VALUES ('Klijent pravno lice');
INSERT INTO vrsta_komitenta ( naziv) VALUES ('Dobavljači');

insert into dogadjaji_vrste (naziv) values ('Rođendan');
insert into dogadjaji_vrste (naziv) values ('Momačko veče');
insert into dogadjaji_vrste (naziv) values ('Đevojačko veče');
insert into dogadjaji_vrste (naziv) values ('Vjenčanje');
insert into dogadjaji_vrste (naziv) values ('Krštenje');

insert into dogadjaji_status_dogadjaja (naziv) values ('Zakazan');
insert into dogadjaji_status_dogadjaja (naziv) values ('Otkazan');
insert into dogadjaji_status_dogadjaja (naziv) values ('Završen');
insert into dogadjaji_status_dogadjaja (naziv) values ('Rezervisan');

insert into dogadjaji_vrste_troskova (naziv) values ('Cvijeće');
insert into dogadjaji_vrste_troskova (naziv) values ('Muzika');
insert into dogadjaji_vrste_troskova (naziv) values ('Piće');
insert into dogadjaji_vrste_troskova (naziv) values ('Hrana');
insert into dogadjaji_vrste_troskova (naziv) values ('Ostalo');

insert into komitent (naziv, pib, pdvbroj, adresa, telefon, email, ziroracun, drzava_id, grad, napomena, vrsta_komitenta_id)
values
    ('Klijent fizičko lice', '123456789', '123456789', 'Adresa 1', '123456789', 'banana22@gmil.com','', 39, 'Podgorica', 'Napomena 1', 1);

