import requests
import json
import os

sources = ["ProbeCube_last.json",
           "LASS_last.json",
           "Indie_last.json",
           "Airbox_last.json"]
path = os.path.dirname(os.path.abspath(__file__));
for src in sources:
  data = requests.get('http://g0vairmap.3203.info/Data/' + src)
  with open(path + '/' + src, 'w') as f:
    json.dump(data.json(), f)
