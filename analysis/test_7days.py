import requests

params = {
    "publishDateTimeFrom": "2024-01-01T00:00:00Z",
    "publishDateTimeTo": "2024-01-08T00:00:00Z" # Exactly 7 days
}

url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH"
r = requests.get(url, params=params)
print(f"Status: {r.status_code}")
if r.status_code == 200:
    print(f"Success! Data count: {len(r.json()['data'])}")
else:
    print(f"Response: {r.json()}")
