import requests
import json

with open('./tcc/results/download.json', 'r') as file:
    data = json.load(file)

destiny_repository = './tcc/results'
dataset_name = 'dataset'

count = 1
for item in data:
    url = item['url']
    filename = item['name']
    response = requests.get(url)
    with open(f'{destiny_repository}/{dataset_name}/{filename}{count}.png', 'wb') as img_file:
        img_file.write(response.content)
    count+=1
