# Use the official Node.js image as the base image
FROM node:16

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 80
EXPOSE 80

# Set environment variables
ENV PORT 80

# Start the application
CMD ["node", "server.js"]
