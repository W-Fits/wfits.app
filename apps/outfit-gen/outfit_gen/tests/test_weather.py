import pytest
from unittest.mock import patch, MagicMock
from outfit_gen.utils.weather import forecast

@pytest.mark.asyncio
@patch("outfit_gen.utils.weather.openmeteo_requests.Client")
@patch("outfit_gen.utils.weather.requests_cache.CachedSession")
async def test_forecast_good(mock_cache, mock_client):
    mock_response = MagicMock()
    mock_hourly = MagicMock()
    mock_hourly.Variables.return_value.ValuesAsNumpy.return_value = [10, 12, 14]
    mock_response.Hourly.return_value = mock_hourly
    mock_response.Hourly.return_value.Time.return_value = 0
    mock_response.Hourly.return_value.TimeEnd.return_value = 3600
    mock_response.Hourly.return_value.Interval.return_value = 1800
    mock_client.return_value.weather_api.return_value = [mock_response]

    result = await forecast(50.0, -1.0)
    assert result["condition"] in ["Cold", "Warm"]
    assert "rain" in result
    assert isinstance(result["average_temp"], float)

@pytest.mark.asyncio
async def test_forecast_bad_coordinates():
    with pytest.raises(Exception):
        await forecast("not-a-float", None)
