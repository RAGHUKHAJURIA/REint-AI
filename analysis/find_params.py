import requests
import pandas as pd

def check(name, params):
    url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH"
    try:
        r = requests.get(url, params=params)
        data = r.json()["data"]
        if data:
            st = data[0]["startTime"]
            print(f"[{name}] First startTime: {st}")
            return st.startswith("2024-01-01")
        return False
    except: return False

options = [
    ("startTime/endTime", {"startTime": "2024-01-01T00:00Z", "endTime": "2024-01-01T12:00Z"}),
    ("publishDateTimeFrom/To", {"publishDateTimeFrom": "2024-01-01T00:00:00Z", "publishDateTimeTo": "2024-01-01T12:00:00Z"}),
    ("from/to", {"from": "2024-01-01T00:00Z", "to": "2024-01-01T12:00Z"}),
    ("from/to-short", {"from": "2024-01-01", "to": "2024-01-01"}),
    ("settlementDate", {"settlementDate": "2024-01-01"})
]

for name, p in options:
    if check(name, p):
        print(f"==> FOUND IT: {name} works!")
        break
