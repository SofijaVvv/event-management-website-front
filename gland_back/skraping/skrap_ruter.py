import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from fastapi import APIRouter
from bs4 import BeautifulSoup
import requests

router = APIRouter()

mobilni_url = (
    'https://www.tehnomax.me/telefoni-i-oprema/mobilni-telefoni/{brojstrane}?mod=catalog&op=browse&view=category&sef_name'
    '=telefoni-i-oprema%2Fmobilni-telefoni&filters[stock][0]=dostupno')
televizori_url = (
    'https://www.tehnomax.me/tv-audio-video/televizori/{brojstrane}?mod=catalog&op=browse&view=category&sef_name=tv'
    '-audio-video%2Ftelevizori&filters%5Bstock%5D%5B0%5D=dostupno')
driver = webdriver.Chrome()
options = webdriver.ChromeOptions()
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36")
driver = webdriver.Chrome(options=options)
# driver.set_window_size(1024, 600)

def skini_stranu(url_sajta):
    link = url_sajta.format(brojstrane=1)

    driver.get(link)
    sacekaj = WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "product-wrap-grid"))
    )
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    proizvodi = []
    for proizvod in soup.find_all('div', class_='product-wrap-grid'):
        naziv_proizvoda = proizvod.find('div', class_='product-name-grid').text
        slika_proizvoda = proizvod.find('div', class_='product-img-wrap-grid').img['src']
        cijena_proizvoda = proizvod.find('div', class_='price').text
        detalji_proizvoda = {
            'naziv_proizvoda': naziv_proizvoda.replace('\n', ''),
            'slika_proizvoda': slika_proizvoda,
            'cijena_proizvoda': cijena_proizvoda.replace('\n', '').replace(' ', '').replace('€', '').replace('.', '') \
                .replace(',', '.')
        }

        proizvodi.append(detalji_proizvoda)

    return proizvodi

def tehnomax():
    rezultat = []
    for i in range(1, 9):
        spisak = skini_stranu(televizori_url.format(brojstrane=i))
        rezultat = rezultat + spisak
        time.sleep(5)
    with open('../ruteri/televizori.py', 'w') as f:
        f.write(json.dumps(rezultat, indent=3))
    print(json.dumps(rezultat, indent=3))

def uzmi_screenshot(site, naziv_fajla):
    driver.get(site)
    time.sleep(5)
    driver.save_screenshot(f'{naziv_fajla}.png')

