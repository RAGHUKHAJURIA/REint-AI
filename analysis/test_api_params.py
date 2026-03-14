import requests
import pandas as pd

def try_params(dataset, param_set):
    url = f"https://data.elexon.co.uk/bmrs/api/v1/datasets/{dataset}"
    try:
        r = requests.get(url, params=param_set)
        data = r.json()["data"]
        if data:
            df = pd.DataFrame(data)
            return df["startTime"].iloc[0] if "startTime" in df.columns else "No startTime"
        else:
            return "Empty"
    except Exception as e:
        return str(e)

test_cases = [
    {"startTime": "2024-01-01T00:00Z", "endTime": "2024-01-01T01:00Z"},
    {"publishDateTimeFrom": "2024-01-01T00:00:00Z", "publishDateTimeTo": "2024-01-01T01:00:00Z"},
    {"from": "2024-01-01T00:00Z", "to": "2024-01-01T01:00Z"},
    {"from": "2024-01-01", "to": "2024-01-01"}
]

print("--- Testing FUELHH ---")
for p in test_cases:
    print(f"Params {p}: {try_params('FUELHH', p)}")

print("\n--- Testing WINDFOR ---")
for p in test_cases:
    print(f"Params {p}: {try_params('WINDFOR', p)}")
