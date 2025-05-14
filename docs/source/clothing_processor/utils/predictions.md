# predictions

## <code>load_model</code>

Predict the class of a preprocessed image using the given model.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| model | tf.keras.Model | The pre-trained TensorFlow model to use for prediction. |
| image | NDArray[Any] | The preprocessed image to predict, in the form of a numpy array. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If the input image is not a valid numpy array or if the prediction fails. |

---

