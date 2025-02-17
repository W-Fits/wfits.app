import tensorflow as tf
import numpy as np
from numpy.typing import NDArray
from typing import Any
import os

# Define class names for the Fashion MNIST model
class_names = [
  'T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
  'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'
]


def load_model() -> tf.keras.Model:
  """Load the TensorFlow model -> tf.keras.Model."""
  try:
    import os
    os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
    return tf.keras.models.load_model('clothing_processor/data/models/fashion_mnist_model.h5')
  except Exception as e:
    raise ValueError(f"Failed to load model: {e}")

def predict_class(model: tf.keras.Model, image: NDArray[Any]) -> str:
  """Predict the class of a preprocessed image -> str."""
  if image is None or not isinstance(image, np.ndarray):
    raise ValueError("Input image must be a valid numpy array.")

  try:
    predictions = model.predict(image)
    predicted_label = np.argmax(predictions)
    return class_names[predicted_label]
  except Exception as e:
    raise ValueError(f"Error during prediction: {e}")