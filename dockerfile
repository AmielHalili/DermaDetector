# Use official Python image
FROM python:3.9-slim

# Set workdir for backend
WORKDIR /app

# Copy backend and model
COPY backend/ /app/backend/
COPY model/ /app/model/
COPY data/ /app/data/

# Install Python deps
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy frontend build into /app/frontend
COPY frontend/build/ /app/frontend/

# Copy backend entry file
COPY backend/app.py /app/app.py


# Expose port
EXPOSE 5000

# Run Flask app
CMD ["python", "app.py"]
