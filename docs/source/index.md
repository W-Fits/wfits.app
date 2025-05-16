# Welcome to the wfits.app Documentation

This site documents the core components and utilities powering the **wfits.app** — a modular system designed for processing clothing images, managing cloud storage, and making predictions.

## 📦 Modules Overview

- **main**: Entry point to handle image uploads and coordination of processing.
- **image**: Utilities for image preprocessing like array conversion, background removal, and color extraction.
- **predictions**: Functions that load and apply machine learning models for classification.
- **s3**: Handles interaction with AWS S3 for file uploads and downloads.
- **files**: Manages local file saving, deletion, and transformations.

```{toctree}
:maxdepth: 3
:caption: Contents:

index.md
clothing_processor/main.md
clothing_processor/utils/image.md
clothing_processor/utils/predictions.md
clothing_processor/utils/s3.md
clothing_processor/utils/files.md
