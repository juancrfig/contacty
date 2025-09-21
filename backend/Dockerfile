FROM python:3.13.3
WORKDIR /app

COPY backend/ ./backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt


EXPOSE 10000

# Startup command
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "backend.app:create_app()"]