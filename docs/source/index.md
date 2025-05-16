# Welcome to the wfits.app Documentation

This documentation covers the main components and utilities of **wfits.app**, a smart clothing recognition and processing platform.

## Modules

### [Main](clothing_processor/main.md)
Handles image upload and coordination between utilities.

### [Image Utilities](clothing_processor/utils/image.md)
Functions for:
- Converting images to arrays
- Removing backgrounds
- Encoding images
- Extracting RGB/HEX colors

### [Predictions](clothing_processor/utils/predictions.md)
Applies machine learning models to classify clothing types or detect features.

### [S3 Storage](clothing_processor/utils/s3.md)
Interacts with AWS S3 for:
- Uploading processed images
- Retrieving stored clothing data

### [File Utilities](clothing_processor/utils/files.md)
Manages local file operations:
- Saving
- Deleting
- Transforming image files

---

```{toctree}
:maxdepth: 3
:caption: Contents:

index.md
clothing_processor/main.md
clothing_processor/utils/image.md
clothing_processor/utils/predictions.md
clothing_processor/utils/s3.md
clothing_processor/utils/files.md
