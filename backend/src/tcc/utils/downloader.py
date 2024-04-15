import requests
import json
import os

with open("C:/Users/marco/OneDrive/Área de Trabalho/crawler/backend/src/tcc/results/download.json", 'r') as file:
    data = json.load(file)

destiny_dataset = "C:/Users/marco/OneDrive/Área de Trabalho/crawler/backend/src/tcc/results/dataset"

if not os.path.exists(destiny_dataset):
    os.mkdir(destiny_dataset)

count = 1
for item in data:
    url = item['url']
    filename = item['breed']
    response = requests.get(url)
    with open(f'{destiny_dataset}/{filename}{count}.png', 'wb') as img_file:
        img_file.write(response.content)
    count+=1
