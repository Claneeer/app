import pytest
from httpx import AsyncClient
from server import app

@pytest.fixture
async def authenticated_client():
    """Fixture para cliente autenticado"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Registrar usuário
        response = await ac.post("/api/auth/register", json={
            "name": "Transaction Test User",
            "email": "transaction@example.com",
            "password": "password123"
        })
        token = response.json()["access_token"]
        ac.headers["Authorization"] = f"Bearer {token}"
        yield ac

@pytest.mark.asyncio
async def test_get_cryptos(authenticated_client):
    """Teste de listar criptomoedas disponíveis"""
    response = await authenticated_client.get("/api/cryptos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["symbol"] == "BTC"

@pytest.mark.asyncio
async def test_buy_crypto(authenticated_client):
    """Teste de compra de criptomoeda"""
    response = await authenticated_client.post("/api/transactions/buy", json={
        "crypto_id": "btc",
        "quantity": 0.001,
        "transaction_type": "buy"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["transaction_type"] == "buy"
    assert data["crypto_symbol"] == "BTC"
    assert data["quantity"] == 0.001

@pytest.mark.asyncio
async def test_buy_invalid_crypto(authenticated_client):
    """Teste de compra com criptomoeda inválida"""
    response = await authenticated_client.post("/api/transactions/buy", json={
        "crypto_id": "invalid",
        "quantity": 0.001,
        "transaction_type": "buy"
    })
    assert response.status_code == 404
    assert "não encontrada" in response.json()["detail"]

@pytest.mark.asyncio
async def test_buy_negative_quantity(authenticated_client):
    """Teste de compra com quantidade negativa"""
    response = await authenticated_client.post("/api/transactions/buy", json={
        "crypto_id": "btc",
        "quantity": -0.001,
        "transaction_type": "buy"
    })
    assert response.status_code == 400
    assert "maior que zero" in response.json()["detail"]

@pytest.mark.asyncio
async def test_sell_insufficient_balance(authenticated_client):
    """Teste de venda com saldo insuficiente"""
    response = await authenticated_client.post("/api/transactions/sell", json={
        "crypto_id": "btc",
        "quantity": 100.0,
        "transaction_type": "sell"
    })
    assert response.status_code == 400
    assert "insuficiente" in response.json()["detail"]

@pytest.mark.asyncio
async def test_buy_and_sell_flow(authenticated_client):
    """Teste de fluxo completo: compra e venda"""
    # Comprar
    buy_response = await authenticated_client.post("/api/transactions/buy", json={
        "crypto_id": "eth",
        "quantity": 0.1,
        "transaction_type": "buy"
    })
    assert buy_response.status_code == 200
    
    # Verificar carteira
    wallet_response = await authenticated_client.get("/api/wallet")
    assert wallet_response.status_code == 200
    wallet = wallet_response.json()
    eth_item = next((item for item in wallet if item["crypto_symbol"] == "ETH"), None)
    assert eth_item is not None
    assert eth_item["quantity"] >= 0.1
    
    # Vender
    sell_response = await authenticated_client.post("/api/transactions/sell", json={
        "crypto_id": "eth",
        "quantity": 0.05,
        "transaction_type": "sell"
    })
    assert sell_response.status_code == 200
    
    # Verificar histórico
    history_response = await authenticated_client.get("/api/transactions/history")
    assert history_response.status_code == 200
    history = history_response.json()
    assert len(history) >= 2  # Compra e venda

@pytest.mark.asyncio
async def test_get_wallet_balance(authenticated_client):
    """Teste de obter saldo da carteira"""
    # Comprar alguma cripto
    await authenticated_client.post("/api/transactions/buy", json={
        "crypto_id": "ada",
        "quantity": 100.0,
        "transaction_type": "buy"
    })
    
    # Verificar saldo
    response = await authenticated_client.get("/api/wallet/balance")
    assert response.status_code == 200
    data = response.json()
    assert "total_brl" in data
    assert data["total_brl"] > 0