FROM python:3.13.3
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 5000

# Startup command
CMD ["flask", "run", "--host=0.0.0.0"]