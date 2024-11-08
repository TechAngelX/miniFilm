# Use the official Node.js image as the base image
FROM node:20.17

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (adjust this if your app uses a different port)
EXPOSE 3000

# Command to run the application
CMD ["node", "server/app.js"]

