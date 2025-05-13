# This is the code for the Training and Usage of our AI model based on Fashion-MNIST
This is a modified version of the Random-Erasing-Master training code with additional code to allow for predictions on the trained model

Link to Original GitHub: https://github.com/zhunzhong07/Random-Erasing

## Structure

```bash
├── checkpoint/        # Stores the best and latest checkpoint from the AI training Process
├── data/              # RAW training data
├── models/            # Contains the different models that can be used for training
├── utils/             # Contains code used in the training process
├── .gitignore         # GitIgnore folder
├── cifar.py
├── CONTRIBUTING.md    # Contribution guidelines
├── fashionmnist.py    # Training Code
├── LICENSE            # Organisation MIT License
├── predict.py         # Code to utilise model for predictions
├── README.md          # Project overview
├── test.jpeg          # Example image for testing predictions
├── transforms.py      # Code used in the Random Erasing part of training
```

## Development

### Clone on your local machine

```bash
git clone https://github.com/W-Fits/ai-model/.git
```

### Navigate to project directory

```bash
cd ai-model
```

### Create a new Branch

```bash
git checkout -b new-branch 
```

## Install Dependencies

#### Training Dependencies:
Numpy
```bash
pip install numpy
```
Pytorch
For Pytorch see [Pytorch](http://pytorch.org/) installation instructions

#### Prediction Dependencies:
PIL
```bash
pip install pillow
```

rembg (Includes Onnx Runtime CPU or GPU (Currently tested using CPU))
```bash
pip install rembg[cpu]
```

## Training
Navigate to project directory
```bash
cd ai-model
```
Run command in CMD
```bash
python fashionmnist.py --dataset fashionmnist --arch wrn --depth 28 --widen-factor 10 --p 0.5 --epoch 1 --checkpoint checkpoint
```

### Pushing Changes

```bash
git add .
git commit -a -m "init commit"
git push -u origin new-branch
```

Now you can create a pull request and request reviewers to merge the changes you have made.

### Commit Message Guidance

We make use of semantic commit messages in our organisation, please follow [this](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) guide for more information.