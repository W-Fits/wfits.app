import torch
import torch.nn as nn
import torch.nn.parallel
import torchvision.utils
import models.fashion as models
import transforms
from PIL import Image
from rembg import remove #Requires Onnx Runtime CPU or GPU (Currently tested using CPU)

# Command Used to Train Model:
# python fashionmnist.py --dataset fashionmnist --arch wrn --depth 28 --widen-factor 10 --p 0.5 --epoch 1 --checkpoint \checkpoint

# Background removal
def remove_background(imagePath):
    input = Image.open(imagePath)
    output = remove(input)
    return output

# Load the pretrained model
model = models.__dict__['wrn'](
    num_classes=10,
    depth=28,
    widen_factor=10,
    dropRate=0
)
if torch.cuda.is_available():
    model = torch.nn.DataParallel(model).cuda()
    checkpoint = torch.load("checkpoint\model_best.pth.tar")
else:
    model = torch.nn.DataParallel(model)
    checkpoint = torch.load("checkpoint\model_best.pth.tar", map_location=torch.device('cpu'))

model.load_state_dict(checkpoint['state_dict'])
model.eval()  # Set the model to evaluation mode

# Define class names for Fashion-MNIST
class_names = [
    "T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
    "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"
]

# Define preprocessing steps for the input image
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),  # Ensure single channel (grayscale)
    transforms.Resize((28, 28)),                  # Resize image to 28x28
    transforms.ToTensor(),                        # Convert image to a PyTorch tensor
    transforms.Normalize((0.1307,), (0.3081,))    # Normalize pixel values to range [-1, 1]
])

testTransform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),  # Ensure single channel (grayscale)
    transforms.Resize((28, 28)),                  # Resize image to 28x28
    transforms.ToTensor()                         # Convert image to a PyTorch tensor
])

# Function to predict the output class of an image
def predict_image(image_path, model):
    # Load the image
    image = remove_background(image_path)
    image.save("testBgRemoved.png")
    
    # Preprocess the image
    input_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    torchvision.utils.save_image(testTransform(image), "transformedImage.jpg")
    torchvision.utils.save_image(transform(image), "transformedNormalizedImage.jpg")

    # Make predictions
    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = output.argmax(dim=1).item()  # Get the class index with highest score

    # Return the predicted class name
    return class_names[predicted_class]

# Usage
image_path = "test1.jpg"
predicted_label = predict_image(image_path, model)
print(f"Predicted Label: {predicted_label}")