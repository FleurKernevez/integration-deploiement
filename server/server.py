import mysql.connector
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

MY_SECRET = os.getenv("JWT_SECRET", "dev_secret_key")
ALGORITHM = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fleurkernevez.github.io", "http://localhost:3000"],
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

@app.post("/login")
async def login_user(login: Login):
    print("Reçu :", login.email, login.password)

    try:
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()
        email = login.email
        password = login.password

        # Requête sécurisée
        sql_select_Query = "SELECT * FROM admin WHERE email = %s AND password = %s"
        cursor.execute(sql_select_Query, (email, password))
        records = cursor.fetchall()

        # Vérifie si les identifiants sont bons
        if cursor.rowcount > 0:
            encoded_jwt = jwt.encode({'email': email}, MY_SECRET, algorithm=ALGORITHM)
            return {"token": encoded_jwt}
        else:
            print("Échec login : identifiants incorrects")
            raise HTTPException(status_code=401, detail="Identifiants incorrects")
    except Exception as e:
        print("Erreur serveur /login :", e)
        raise HTTPException(status_code=500, detail="Erreur serveur")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/admins")
async def get_admins():
    try:
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admin")
        records = cursor.fetchall()
        return {"admins": records}
    except Exception as e:
        print("Erreur /admins :", e)
        raise HTTPException(status_code=500, detail=str(e))


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
        # Vérifie et décode le token
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])
        email_admin = decoded_payload.get("email")

        # Connexion DB
        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()

        # Supprime l'utilisateur
        delete_query = "DELETE FROM utilisateur WHERE id = %s"
        cursor.execute(delete_query, (id,))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        return {"message": f"Utilisateur {id} supprimé avec succès"}

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")

    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

    except Exception as e:
        print(f"Erreur lors de la suppression : {e}")
        raise HTTPException(status_code=500, detail="Erreur interne serveur")

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


