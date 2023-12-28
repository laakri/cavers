# Use an official Node runtime as a parent image
FROM node:16 as build

# Set the working directory to /frontend
WORKDIR /frontend

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Add the following lines to install the required packages
RUN npm i primeng@16.9.1
RUN npm install primeicons
RUN npm install quill

# Copy the frontend code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use a smaller image for the runtime
FROM nginx:alpine

# Remove the default nginx website
COPY nginx/* /etc/nginx/conf.d/

# Copy the built Angular app from the build stage
COPY --from=build /frontend/dist/cavers /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80
