FROM python:3.12-alpine

RUN adduser -D -H app
WORKDIR /app
COPY server.py /app/server.py
USER app

EXPOSE 8080 2222
CMD ["python3", "/app/server.py"]
