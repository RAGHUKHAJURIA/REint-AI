import requests
import pandas as pd

params = {"publishDateTimeFrom": "2024-01-01T00:00:00Z", "publishDateTimeTo": "2024-01-01T12:00:00Z"}

print("--- Actual (FUELHH) ---")
r1 = requests.get("https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH", params=params)
d1 = r1.json()["data"]
if d1:
    print(f"First startTime: {d1[0]['startTime']}")
else: print("EMPTY")

print("\n--- Forecast (WINDFOR) ---")
r2 = requests.get("https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR", params=params)
d2 = r2.json()["data"]
if d2:
    print(f"First startTime: {d2[0]['startTime']}")
else: print("EMPTY")
