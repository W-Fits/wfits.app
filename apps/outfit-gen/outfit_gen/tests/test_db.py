import pytest
from outfit_gen.utils.db import parse_filters

# Test case for valid filter values
def test_parse_filters_valid():
    # Sample filters with valid values
    filters = {
        "colour_id": "1",  # Valid string representing an int
        "category_id": 2,  # Valid int
        "environment": "Warm",  # Valid string
        "waterproof": "True",  # Valid string representing a boolean
    }
    
    # Call the function to parse the filters
    parsed = parse_filters(filters)
    
    # Verify that the parsed output matches the expected values with correct types
    assert parsed == {
        "colour_id": 1,  # Converted string '1' to integer
        "category_id": 2,
        "environment": "Warm",
        "waterproof": True  # Converted string 'True' to boolean
    }

# Test case to handle invalid types in the filters
def test_parse_filters_invalid_types():
    # Sample filters with invalid or unsupported values
    filters = {
        "colour_id": "blue",  # Invalid value: should be an int
        "environment": "Freezing",  # Invalid environment value
        "unknown": "ignored"  # Disallowed key
    }
    
    # Call the function to parse the filters
    parsed = parse_filters(filters)
    
    # Verify that the result is an empty dictionary since all values are invalid
    assert parsed == {}

# Test case for partially valid filter values
def test_parse_filters_partial_valid():
    # Sample filters where only some values are valid
    filters = {
        "category_id": 2,  # Valid int
        "size_id": "L"  # Invalid value: should be an int
    }
    
    # Call the function to parse the filters
    parsed = parse_filters(filters)
    
    # Verify that only the valid filter ("category_id") is returned
    assert parsed == {"category_id": 2}
