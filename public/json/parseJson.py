import requests
import json

sources = ["ProbeCube_last.json",
           "LASS_last.json",
           "Indie_last.json",
           "Airbox_last.json"]
for src in sources:
  data = requests.get('http://g0vairmap.3203.info/Data/' + src)
  # print(data.json())
  with open('./' + src, 'w') as f:
    json.dump(data.json(), f)