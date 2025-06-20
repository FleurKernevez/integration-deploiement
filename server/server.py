import mysql.connector
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Login(BaseModel):
    email: str
    password: str

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

@app.post("/admin")
async def create_user(login: Login):
    print("Reçu :", login.email, login.password)
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

@app.get("/admin")
async def test_login(email: str, password: str):
    print(f"Tentative de connexion GET - Email: {email}, Mot de passe: {password}")

    try:
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()

        sql = "SELECT * FROM admin WHERE email = %s AND password = %s"
        cursor.execute(sql, (email, password))
        records = cursor.fetchall()

        if records:
            return {"message": "Connexion réussie", "admin": email}
        else:
            return {"message": "Identifiants incorrects"}

    except Exception as e:
        print("Erreur GET /admin :", e)
        return {"error": str(e)}

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

@app.delete("/users")
async def deleteUser(id: str, authorization: Optional[str] = Header(None)):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme. Must be 'Bearer'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    try:
        # Décoder le jeton. PyJWT vérifie automatiquement la signature et l'expiration.
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])
        ##TODO delete user whith id
        return True
    except ExpiredSignatureError:
        print("Erreur : Le jeton JWT a expiré.")
        raise Exception("Bad credentials")
    except InvalidTokenError as e:
        print(f"Erreur : Le jeton JWT est invalide : {e}")
        raise Exception("Bad credentials")
    except Exception as e:
        print(f"Une erreur inattendue est survenue lors de la vérification du jeton : {e}")
        raise Exception("Bad credentials")