import pytest
from httpx import AsyncClient
from server import app
import asyncio

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_register_user(client):
    """Teste de registro de novo usuário"""
    response = await client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    """Teste de registro com email duplicado"""
    # Primeiro registro
    await client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "duplicate@example.com",
        "password": "password123"
    })
    
    # Segundo registro com mesmo email
    response = await client.post("/api/auth/register", json={
        "name": "Test User 2",
        "email": "duplicate@example.com",
        "password": "password456"
    })
    assert response.status_code == 400
    assert "já cadastrado" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(client):
    """Teste de login com credenciais corretas"""
    # Registrar usuário
    await client.post("/api/auth/register", json={
        "name": "Login Test",
        "email": "login@example.com",
        "password": "password123"
    })
    
    # Login
    response = await client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@example.com"

@pytest.mark.asyncio
async def test_login_wrong_password(client):
    """Teste de login com senha incorreta"""
    # Registrar usuário
    await client.post("/api/auth/register", json={
        "name": "Wrong Pass Test",
        "email": "wrongpass@example.com",
        "password": "password123"
    })
    
    # Login com senha errada
    response = await client.post("/api/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "incorretos" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_me_authenticated(client):
    """Teste de obter dados do usuário autenticado"""
    # Registrar e fazer login
    register_response = await client.post("/api/auth/register", json={
        "name": "Auth Test",
        "email": "auth@example.com",
        "password": "password123"
    })
    token = register_response.json()["access_token"]
    
    # Obter dados do usuário
    response = await client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "auth@example.com"

@pytest.mark.asyncio
async def test_get_me_unauthenticated(client):
    """Teste de obter dados sem autenticação"""
    response = await client.get("/api/auth/me")
    assert response.status_code == 403  # Forbidden sem token