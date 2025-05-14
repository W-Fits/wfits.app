import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
from typing import Tuple, Optional


async def forecast(latitude: float, longitude: float, temperature_threshold: float = 12) -> Tuple[bool, str]:
  """
  Get weather forecast and determine temperature condition based on location.

  :param latitude: Geographic latitude of the location.
  :type latitude: float
  :param longitude: Geographic longitude of the location.
  :type longitude: float
  :param temperature_threshold: Temperature threshold to classify as 'Cold' or 'Warm'.
  :type temperature_threshold: float
  :raise Exception: If the weather API request fails.
  :return: Dictionary with rain flag, temperature condition, and average temperature.
  :rtype: dict[str, Any]
  """
  cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
  retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
  openmeteo = openmeteo_requests.Client(session=retry_session)

  url = "https://api.open-meteo.com/v1/forecast"
  params = {
    "latitude": latitude,
    "longitude": longitude,
    "hourly": "temperature_2m",  # "precipitation_probability",  # Add precipitation probability
  }
  responses = openmeteo.weather_api(url, params=params)

  response = responses[0]

  hourly = response.Hourly()
  hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()

  hourly_data = {
      "date": pd.date_range(
          start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
          end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
          freq=pd.Timedelta(seconds=hourly.Interval()),
          inclusive="left",
      ),
      "temperature_2m": hourly_temperature_2m,
  }

  hourly_dataframe = pd.DataFrame(data=hourly_data)

  average_temperature = hourly_dataframe["temperature_2m"].mean()
  temperature_condition = (
    "Cold" if average_temperature < temperature_threshold else "Warm"
  )

  return {
    "rain" : False,
    "condition" : temperature_condition,
    "average_temp": average_temperature
  }
