import requests
import pandas as pd

params = {"startTime": "2024-01-01T00:00Z", "endTime": "2024-01-01T12:00Z"}

print("--- Actual ---")
r1 = requests.get("https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH", params=params)
d1 = r1.json()["data"]
if d1:
    df1 = pd.DataFrame(d1)
    print(f"Unique startTimes: {df1['startTime'].unique()[:5]}")
    print(f"Columns: {df1.columns.tolist()}")
else:
    print("Actual data is EMPTY")

print("\n--- Forecast ---")
r2 = requests.get("https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR", params=params)
d2 = r2.json()["data"]
if d2:
    df2 = pd.DataFrame(d2)
    print(f"Unique startTimes: {df2['startTime'].unique()[:5]}")
    print(f"Columns: {df2.columns.tolist()}")
else:
    print("Forecast data is EMPTY")
