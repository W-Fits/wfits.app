import pytest
import asyncio
from unittest.mock import patch, MagicMock
from outfit_gen.utils.weather import forecast  # adjust this import path accordingly

# This test checks if the 'forecast' function correctly classifies cold conditions based on hourly temperature data.
@pytest.mark.asyncio
async def test_forecast_cold_condition():
    # Create a MagicMock object to mock the response object from the weather API
    mock_response = MagicMock()
    mock_hourly = MagicMock()

    # Simulate hourly temperature values below the threshold of 15°C
    mock_hourly.Variables.return_value.ValuesAsNumpy.return_value = [10.0, 12.0, 13.5]
    mock_hourly.Time.return_value = 1715133600 
    mock_hourly.TimeEnd.return_value = 1715144400 
    mock_hourly.Interval.return_value = 3600 

    # Return the mock hourly data when Hourly is called
    mock_response.Hourly.return_value = mock_hourly

    # Use patching to replace the actual API call with the mocked response
    with patch("openmeteo_requests.Client") as mock_client_class:
        # Mock the behavior of the weather API client to return the mock response
        mock_client = mock_client_class.return_value
        mock_client.weather_api.return_value = [mock_response]  # Simulate the API returning the mock response

        # Call the forecast function with the mocked response data
        result = await forecast(50.0, 8.0, temperature_threshold=15.0)

        # Assert that the condition is correctly identified as "Cold" based on the hourly temperatures being below the threshold
        assert result["condition"] == "Cold"

        # Assert that there is no rain in the result (mocking no rain data here)
        assert result["rain"] is False

        # Assert that the average temperature in the result is a float type
        assert isinstance(result["average_temp"], float)

        # Dynamically generated output for test result
        print({
            "status": 200,
            "message": f"Forecast test passed: {result}"
        })