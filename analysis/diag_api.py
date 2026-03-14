import requests

params = {
    "publishDateTimeFrom": "2024-01-01T00:00:00Z",
    "publishDateTimeTo": "2024-02-01T00:00:00Z"
}

url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH"
r = requests.get(url, params=params)
print(f"Status: {r.status_code}")
print(f"Response: {r.json()}")
