import pytest
import numpy as np
from unittest.mock import patch, MagicMock

from clothing_processor.utils.predictions import (
  class_names,
  load_model,
  predict_class,
)

# load_model() Tests
@patch("clothing_processor.utils.predictions.tf.keras.models.load_model")
def test_load_model_success(mock_load_model):
    mock_model = MagicMock()
    mock_load_model.return_value = mock_model
    model = load_model()
    mock_load_model.assert_called_once_with("clothing_processor/data/models/fashion_mnist_model.h5")
    assert model == mock_model

@patch("clothing_processor.utils.predictions.tf.keras.models.load_model")
def test_load_model_failure(mock_load_model):
    mock_load_model.side_effect = Exception("File not found")
    with pytest.raises(ValueError, match="Failed to load model: File not found"):
        load_model()

# predict_class() Tests
def test_predict_class_valid():
    mock_model = MagicMock()
    mock_prediction = np.array([[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2]])  # Highest value for index 9
    mock_model.predict.return_value = mock_prediction
    dummy_image = np.random.rand(1, 28, 28)
    result = predict_class(mock_model, dummy_image)
    assert result == class_names[9]

def test_predict_class_none_input():
    mock_model = MagicMock()
    with pytest.raises(ValueError, match="Input image must be a valid numpy array."):
        predict_class(mock_model, None)

def test_predict_class_invalid_input_type():
    mock_model = MagicMock()
    with pytest.raises(ValueError, match="Input image must be a valid numpy array."):
        predict_class(mock_model, "not an image")