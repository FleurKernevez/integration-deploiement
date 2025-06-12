import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello():
    return {"message": "Hello, World!"}

@app.get("/users")
async def get_users():
    try:
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306, 
            host=os.getenv("MYSQL_HOST"))
        cursor = conn.cursor()
        sql_select_Query = "select * from utilisateur"
        cursor.execute(sql_select_Query)
        # get all records
        records = cursor.fetchall()
        print("Total number of rows in table: ", cursor.rowcount)
        # renvoyer nos données et 200 code OK
        return {'utilisateurs': records}
    except Exception as e:
        print(e)
        print("An exception occurred")
    # Connexion à la base de données

@app.post("/login")
async def create_user(login: Login):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306, 
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    email = login.email
    password = login.password
    sql_select_Query = "select * from admin WHERE email=\""+ str(email) +"\" AND password=\""+ str(password)+"\";"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    if cursor.rowcount > 0:
        encoded_jwt = jwt.encode({'data': [{'email':email}]}, MY_SECRET, algorithm=ALGORITHM)
        return encoded_jwt
    else:
        raise Exception("Bad credentials")

@app.post("/users")
async def create_user(user: dict):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306, 
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    sql_insert_Query = "INSERT INTO utilisateur (nom, prenom, email, dateDeNaissance, ville, codePostal) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (user['nom'], user['prenom'], user['email'], user['dateDeNaissance'], user['ville'], user['codePostal'])
    cursor.execute(sql_insert_Query, values)
    conn.commit()
    return {'message': 'User created successfully', 'user_id': cursor.lastrowid}