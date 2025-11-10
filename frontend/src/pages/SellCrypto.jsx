import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const SellCrypto = ({ user, setUser }) => {
  const [wallet, setWallet] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data);
    } catch (error) {
      toast.error('Erro ao carregar carteira');
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (!selectedCrypto || !quantity || parseFloat(quantity) <= 0) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    if (parseFloat(quantity) > selectedCrypto.quantity) {
      toast.error('Quantidade insuficiente');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transactions/sell', {
        crypto_id: selectedCrypto.crypto_id,
        quantity: parseFloat(quantity),
        transaction_type: 'sell'
      });
      toast.success(`Venda de ${quantity} ${selectedCrypto.crypto_symbol} realizada com sucesso!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao realizar venda');
    } finally {
      setLoading(false);
    }
  };

  const total = selectedCrypto && quantity ? (parseFloat(quantity) * selectedCrypto.price_brl) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar user={user} setUser={setUser} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-gray-200 transition-colors"
          data-testid="sell-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#1E3A8A' }} data-testid="sell-title">
          Vender Criptomoedas
        </h1>

        {wallet.length === 0 ? (
          <Card className="p-12 text-center shadow-md" data-testid="sell-empty-wallet">
            <p className="text-gray-600 mb-4">Você não possui criptomoedas para vender</p>
            <Button
              onClick={() => navigate('/buy')}
              className="text-white font-semibold px-8 py-5 rounded-lg"
              style={{ backgroundColor: '#10B981' }}
              data-testid="sell-empty-buy-button"
            >
              Comprar Criptomoedas
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#1E3A8A' }}>Suas Criptomoedas</h3>
              <div className="space-y-3" data-testid="sell-wallet-list">
                {wallet.map((item) => (
                  <Card
                    key={item.crypto_id}
                    className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCrypto?.crypto_id === item.crypto_id ? 'ring-2 shadow-lg' : ''
                    }`}
                    style={{
                      borderColor: selectedCrypto?.crypto_id === item.crypto_id ? '#EF4444' : 'transparent',
                      backgroundColor: selectedCrypto?.crypto_id === item.crypto_id ? '#FEF2F2' : 'white'
                    }}
                    onClick={() => setSelectedCrypto(item)}
                    data-testid={`sell-crypto-${item.crypto_symbol.toLowerCase()}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.crypto_symbol === 'BTC' ? '₿' : item.crypto_symbol === 'ETH' ? 'Ξ' : item.crypto_symbol}</div>
                        <div>
                          <h4 className="font-bold" style={{ color: '#1E3A8A' }}>{item.crypto_symbol}</h4>
                          <p className="text-sm text-gray-600">{item.crypto_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Disponível:</span>
                      <span className="font-semibold">{item.quantity.toFixed(8)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preço:</span>
                      <span className="font-semibold">R$ {item.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sell Form */}
            <div>
              <Card className="p-8 shadow-lg sticky top-24">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#1E3A8A' }}>Detalhes da Venda</h3>
                
                {!selectedCrypto ? (
                  <p className="text-gray-600 text-center py-12">Selecione uma criptomoeda para continuar</p>
                ) : (
                  <form onSubmit={handleSell} className="space-y-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{selectedCrypto.crypto_symbol === 'BTC' ? '₿' : selectedCrypto.crypto_symbol === 'ETH' ? 'Ξ' : selectedCrypto.crypto_symbol}</span>
                        <div>
                          <p className="font-bold" style={{ color: '#1E3A8A' }}>{selectedCrypto.crypto_name}</p>
                          <p className="text-sm text-gray-600">{selectedCrypto.crypto_symbol}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          Disponível: <span className="font-semibold">{selectedCrypto.quantity.toFixed(8)}</span>
                        </p>
                        <p className="text-gray-600">
                          Preço: <span className="font-semibold">R$ {selectedCrypto.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quantity" className="text-gray-700 font-medium">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="any"
                        min="0.00000001"
                        max={selectedCrypto.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="mt-1.5"
                        placeholder="0.00000000"
                        data-testid="sell-quantity-input"
                      />
                      <p className="text-xs text-gray-500 mt-1">Máximo: {selectedCrypto.quantity.toFixed(8)}</p>
                    </div>

                    {quantity && parseFloat(quantity) > 0 && (
                      <div className="p-6 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                        <p className="text-gray-600 mb-2">Você receberá:</p>
                        <p className="text-3xl font-bold" style={{ color: '#10B981' }} data-testid="sell-total-amount">
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !quantity || parseFloat(quantity) <= 0}
                      className="w-full text-white font-semibold py-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#EF4444' }}
                      data-testid="sell-confirm-button"
                    >
                      {loading ? 'Processando...' : 'Confirmar Venda'}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellCrypto;