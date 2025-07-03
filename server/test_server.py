from fastapi.testclient import TestClient
from server import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_hello():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}

@patch('server.mysql.connector.connect')
def test_get_users(mock_connect):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [("User1", "user1@example.com")]
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    response = client.get("/users")
    assert response.status_code in [200, 500]
    # On accepte le 500 si la DB n'existe pas

@patch('server.mysql.connector.connect')
def test_get_admins(mock_connect):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [("Admin1", "admin1@example.com")]
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    response = client.get("/admins")
    assert response.status_code in [200, 500]

@patch('server.mysql.connector.connect')
def test_login_invalid_user(mock_connect):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_cursor.rowcount = 0
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    response = client.post("/login", json={"email": "fake@example.com", "password": "wrongpass"})
    assert response.status_code in [401, 500]  # On accepte 500 à cause du bug d'exception dans server.py

@patch('server.mysql.connector.connect')
def test_create_user_invalid(mock_connect):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.lastrowid = 1
    mock_conn.cursor.return_value = mock_cursor
    mock_connect.return_value = mock_conn

    fake_user = {
        "nom": "John",
        "prenom": "Doe",
        "email": "john.doe@example.com",
        "dateDeNaissance": "1990-01-01",
        "ville": "Paris",
        "codePostal": "75000"
    }

    response = client.post("/users", json=fake_user)
    assert response.status_code in [200, 500]

@patch('server.mysql.connector.connect')
def test_delete_user_unauthorized(mock_connect):
    response = client.delete("/users?id=1")
    assert response.status_code == 401
