# Use a lightweight base image with PostgREST pre-installed
FROM postgrest/postgrest:latest

# Set the working directory
WORKDIR /app

# Expose the port specified in the PostgREST configuration
EXPOSE 3000

# Command to run PostgREST (will use environment variables from docker-compose)
CMD ["postgrest"]