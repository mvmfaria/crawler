import requests
import json
import os

with open("C:/Users/marco/OneDrive/Área de Trabalho/crawler/backend/src/tcc/results/download.json", 'r') as file:
    data = json.load(file)

destiny_dataset = "C:/Users/marco/OneDrive/Área de Trabalho/crawler/backend/src/tcc/results/dataset"

if not os.path.exists(destiny_dataset):
    os.mkdir(destiny_dataset)

for item in data:
    
    url = item['url']
    filename = item['breed']
    response = requests.get(url)

    folder_path = f'{destiny_dataset}/{filename}'
    if not os.path.exists(folder_path):
        os.mkdir(folder_path)

    count = 1
    while os.path.exists(f'{folder_path}/{count}.png'):
        count += 1

    with open(f'{destiny_dataset}/{filename}/{count}.png', 'wb') as img_file:
        img_file.write(response.content)