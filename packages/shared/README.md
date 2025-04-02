# W-Fits Clothing Processor

This microservice processes an uploaded image by preparing it for a machine learning model, uploading it to S3, classifying the item, and identifying its dominant colour. 

<!-- TODO: ray.so code image -->
## Usage

### Example
<!-- ```sh
curl -X POST "https://<api>.north-eu-1.amazonaws.com/upload/" \
     -H "Authorization: Bearer <access_token>" \
     -F "upload_file=@path/to/image.jpeg"
``` -->
![Example curl request](docs/images/curl.png)

### Response
<!-- ```js
{
  "class": "T-Shirt",
  "colour": {
    "name": "Blue",
    "value": "#0000FF",
  },
  "image_url": "https://wfits-bucket.s3.amazonaws.com/image_id.png"
}
``` -->

![Example response body](docs/images/response.png)

## Documentation

Visit [link](https://link-to-docs.com) to view the documentation online or open [docs.md](/docs/DOCS.md).

## Contributing

Please read the [contribution guide](/CONTRIBUTING.md)

## License

Licensed under the  [MIT license](/LICENSE).