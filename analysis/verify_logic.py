import pandas as pd
import numpy as np
import requests
import warnings

warnings.filterwarnings('ignore')

def select_forecast(target_time, forecast_df, horizon_hours=4):
    cutoff = target_time - pd.Timedelta(hours=horizon_hours)
    valid = forecast_df[(forecast_df["startTime"] == target_time) & (forecast_df["publishTime"] <= cutoff)]
    if valid.empty:
        return np.nan
    return valid.sort_values("publishTime").iloc[-1]["forecast"]

print("Testing Actual Data Load...")
url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH"
params = {"startTime": "2024-01-01T00:00Z", "endTime": "2024-01-04T00:00Z"} 
response = requests.get(url, params=params)
data = response.json()
actual_df = pd.DataFrame(data["data"])
actual_df["startTime"] = pd.to_datetime(actual_df["startTime"]).dt.tz_localize(None)
if "fuelType" in actual_df.columns:
    actual_df = actual_df[actual_df["fuelType"] == "WIND"]
actual_df = actual_df[["startTime", "generation"]].copy()
actual_df.rename(columns={"generation": "actual"}, inplace=True)
print(f"Loaded {len(actual_df)} actual wind records.")

print("Testing Forecast Data Load...")
forecast_url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR"
response_f = requests.get(forecast_url, params=params)
forecast_df = pd.DataFrame(response_f.json()["data"])
forecast_df["startTime"] = pd.to_datetime(forecast_df["startTime"]).dt.tz_localize(None)
forecast_df["publishTime"] = pd.to_datetime(forecast_df["publishTime"]).dt.tz_localize(None)
forecast_df.rename(columns={"generation": "forecast"}, inplace=True)
print(f"Loaded {len(forecast_df)} forecast records.")

print("\nSample Forecast Rows:")
print(forecast_df.head())
print("\nSample Actual Rows:")
print(actual_df.head())

print("\nTesting Selection Logic...")
actual_df["forecast"] = actual_df["startTime"].apply(lambda x: select_forecast(x, forecast_df, 4))
analysis_df = actual_df.dropna(subset=["forecast"]).copy()
print(f"Mapped {len(analysis_df)} intervals with forecast.")

if not analysis_df.empty:
    analysis_df["error"] = analysis_df["actual"] - analysis_df["forecast"]
    mae = analysis_df["error"].abs().mean()
    print(f"Success! MAE: {mae:.2f}")
else:
    print("Warning: No matching intervals found in test sample.")
