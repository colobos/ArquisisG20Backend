# Use the python:3.8.10 image as your base image
FROM python:3.8.10-alpine

# Create app directory
WORKDIR /app

# Install necessary packages
RUN apk add --no-cache build-base python3-dev py3-pip

# Install NumPy
# RUN pip install numpy

# Copy the files that declare the dependencies
COPY Pipfile* ./

# Upgrade pip
RUN pip install pip --upgrade

# Install Pipenv
RUN pip install pipenv

# Install the project's dependencies using Pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy all the files into the container to run the app
COPY . .