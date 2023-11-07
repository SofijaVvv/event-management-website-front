import json

from bs4 import BeautifulSoup

sajt = ""
with (open('index.html', 'r')) as f:
    sajt = f.read()
soup = BeautifulSoup(sajt, 'html.parser')


linkovi = []
for proizvod in soup.find_all('div', class_='stavka'):
    slika = proizvod.find('img')['src']
    link = proizvod.find('a')['href']
    naziv = proizvod.find('a').text
    opis = proizvod.find('p', class_='opis').text
    linkovi.append({
        'slika': slika,
        'link': link,
        'naziv': naziv,
        'opis': opis
    })
print(json.dumps(linkovi, indent=3))