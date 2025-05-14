# image

## <code>to_image_array</code>

Convert a PIL Image to a NumPy array.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image | ImageFile.Image | The input PIL Image. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If conversion fails or the array is empty. |

---



## <code>remove_background</code>

Preprocess a PIL Image for model input.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image | Image.Image | The input PIL Image. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If image is invalid or preprocessing fails. |

---



## <code>to_base64</code>

Convert a PIL Image to a Base64 encoded string.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image | Image.Image | The input PIL Image. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If conversion to base64 fails. |

---



## <code>get_rgb_colour</code>

Find the dominant RGB colour of an image array.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image_array | NDArray[Any] | The input NumPy image array. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If no visible pixels are found or the input is invalid. |

---



## <code>get_hex_colour</code>

Convert the dominant RGB colour of an image array to hex code.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image_array | NDArray[Any] | The input NumPy image array. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If no visible pixels are found or the input is invalid. |

---



## <code>rgb_to_hex</code>

Convert an RGB tuple to a hex code.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| rgb | tuple | The RGB tuple. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If the RGB tuple is invalid. |

---



## <code>hex_to_rgb</code>

Convert a hex code to an RGB tuple.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| hex_code | str | The hex code to convert. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If the hex code is invalid. |

---



## <code>calculate_distance</code>

Calculate the Euclidean distance between two RGB colours.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| colour1 | tuple | The first RGB tuple. |
| colour2 | tuple | The second RGB tuple. |

### Throws:
| Type | Description |
| ---- | ----------- |
| ValueError: | If the inputs are not valid RGB tuples. |

---



## <code>match_colour</code>

Match RGB colour to the closest in the colour map.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| rgb | Tuple[int, | The RGB tuple to match. |

---



## <code>get_colour</code>

Find the closest colour match for the dominant colour in an image.

### Parameters:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image_array | NDArray[Any] | The input NumPy image array. |

---

