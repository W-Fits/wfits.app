import pytest
from outfit_gen.utils.db import parse_filters

def test_parse_filters_valid():
    filters = {
        "colour_id": "1",
        "category_id": 2,
        "environment": "Warm",
        "waterproof": "True",
    }
    parsed = parse_filters(filters)
    assert parsed == {
        "colour_id": 1,
        "category_id": 2,
        "environment": "Warm",
        "waterproof": True
    }

def test_parse_filters_invalid_types():
    filters = {
        "colour_id": "blue",  # invalid int
        "environment": "Freezing",  # invalid env
        "unknown": "ignored"  # disallowed key
    }
    parsed = parse_filters(filters)
    assert parsed == {}

def test_parse_filters_partial_valid():
    filters = {
        "category_id": 2,
        "size_id": "L"  # invalid int
    }
    parsed = parse_filters(filters)
    assert parsed == {"category_id": 2}
