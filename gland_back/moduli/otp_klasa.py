import pyotp
import urllib.parse

from baznimodeli import ItemOperater


# kljuc = pyotp.random_base32()
# print(kljuc)


def provjeraotp(otp, kljuc):
    totp = pyotp.TOTP(kljuc)
    return totp.verify(otp)


def qrkorisnika(podaci_operatera: ItemOperater):
    link = 'otpauth://totp/{ime}:{email}?secret={kljuc}&issuer=GravelLand'.format(ime=podaci_operatera.ime,
                                                                                  kljuc=podaci_operatera.kljuc,
                                                                                  email=podaci_operatera.email)
    rezultat = 'https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl={link}'.format(link=urllib.parse.quote(link))
    return rezultat
