import pytest
from httpx import AsyncClient
from server import app

@pytest.fixture
async def authenticated_client():
    """Fixture para cliente autenticado"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/register", json={
            "name": "CRUD Test User",
            "email": "crud@example.com",
            "password": "password123"
        })
        token = response.json()["access_token"]
        ac.headers["Authorization"] = f"Bearer {token}"
        yield ac

@pytest.mark.asyncio
async def test_update_user_name(authenticated_client):
    """Teste de atualização do nome do usuário"""
    response = await authenticated_client.put("/api/auth/update", json={
        "name": "Updated Name"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"

@pytest.mark.asyncio
async def test_update_user_password(authenticated_client):
    """Teste de atualização da senha do usuário"""
    response = await authenticated_client.put("/api/auth/update", json={
        "password": "newpassword123"
    })
    assert response.status_code == 200
    
    # Tentar fazer login com nova senha
    async with AsyncClient(app=app, base_url="http://test") as new_client:
        login_response = await new_client.post("/api/auth/login", json={
            "email": "crud@example.com",
            "password": "newpassword123"
        })
        assert login_response.status_code == 200

@pytest.mark.asyncio
async def test_delete_user_account(authenticated_client):
    """Teste de exclusão da conta do usuário"""
    # Deletar conta
    response = await authenticated_client.delete("/api/auth/delete")
    assert response.status_code == 200
    assert "deletada" in response.json()["message"]
    
    # Tentar acessar com token antigo (deve falhar)
    me_response = await authenticated_client.get("/api/auth/me")
    assert me_response.status_code == 401

@pytest.mark.asyncio
async def test_read_user_profile(authenticated_client):
    """Teste de leitura do perfil do usuário"""
    response = await authenticated_client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "crud@example.com"
    assert data["name"] == "CRUD Test User"
    assert "id" in data
    assert "created_at" in data