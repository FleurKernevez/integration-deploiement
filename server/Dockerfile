FROM python:3.9
WORKDIR /server
COPY . .
RUN pip install mysql-connector-python fastapi uvicorn
EXPOSE 8000
RUN pip install PyJWT