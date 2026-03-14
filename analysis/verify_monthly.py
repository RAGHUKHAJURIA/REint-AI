import pandas as pd
import numpy as np
import requests
import warnings
from datetime import datetime, timedelta

warnings.filterwarnings('ignore')

def fetch_bmrs_data(dataset, start_date, end_date):
    url = f"https://data.elexon.co.uk/bmrs/api/v1/datasets/{dataset}"
    all_data = []
    current_start = datetime.strptime(start_date, "%Y-%m-%d")
    final_end = datetime.strptime(end_date, "%Y-%m-%d")
    while current_start < final_end:
        current_end = min(current_start + timedelta(days=7), final_end)
        params = {
            "publishDateTimeFrom": current_start.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "publishDateTimeTo": current_end.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        r = requests.get(url, params=params)
        if r.status_code == 200:
            batch = r.json().get("data", [])
            all_data.extend(batch)
        else:
            print(f"Error {r.status_code} for batch {current_start}")
        current_start = current_end
    return pd.DataFrame(all_data)

def select_forecast(target_time, forecast_df, horizon_hours=4):
    cutoff = target_time - pd.Timedelta(hours=horizon_hours)
    mask = (forecast_df["startTime"] == target_time) & (forecast_df["publishTime"] <= cutoff)
    valid = forecast_df[mask]
    if valid.empty: return np.nan
    return valid.sort_values("publishTime").iloc[-1]["forecast"]

print("Fetching monthly data in chunks...")
actual_df = fetch_bmrs_data("FUELHH", "2024-01-01", "2024-02-01")
if actual_df.empty:
    print("FAILED: actual_df is empty.")
    exit(1)

actual_df["startTime"] = pd.to_datetime(actual_df["startTime"]).dt.tz_localize(None)
if "fuelType" in actual_df.columns:
    actual_df = actual_df[actual_df["fuelType"] == "WIND"]
actual_df = actual_df[["startTime", "generation"]].copy()
actual_df.rename(columns={"generation": "actual"}, inplace=True)

forecast_df = fetch_bmrs_data("WINDFOR", "2024-01-01", "2024-02-01")
if forecast_df.empty:
    print("FAILED: forecast_df is empty.")
    exit(1)

forecast_df["startTime"] = pd.to_datetime(forecast_df["startTime"]).dt.tz_localize(None)
forecast_df["publishTime"] = pd.to_datetime(forecast_df["publishTime"]).dt.tz_localize(None)
forecast_df.rename(columns={"generation": "forecast"}, inplace=True)

print(f"Processing matching for {len(actual_df)} actual intervals...")
# Use vectorized merge or apply? Apply is safer for the logic
actual_df["forecast"] = actual_df["startTime"].apply(lambda x: select_forecast(x, forecast_df, 4))
df = actual_df.dropna(subset=["forecast"]).copy()

if not df.empty:
    df["error"] = df["actual"] - df["forecast"]
    print(f"SUCCESS! Matched {len(df)} intervals. MAE: {df['error'].abs().mean():.2f}")
else:
    print("FAILED: No matches found in full month data.")
