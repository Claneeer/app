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

const BuyCrypto = ({ user, setUser }) => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await api.get('/cryptos');
      setCryptos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar criptomoedas');
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!selectedCrypto || !quantity || parseFloat(quantity) <= 0) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transactions/buy', {
        crypto_id: selectedCrypto.id,
        quantity: parseFloat(quantity),
        transaction_type: 'buy'
      });
      toast.success(`Compra de ${quantity} ${selectedCrypto.symbol} realizada com sucesso!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao realizar compra');
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
          data-testid="buy-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#1E3A8A' }} data-testid="buy-title">
          Comprar Criptomoedas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crypto Selection */}
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#1E3A8A' }}>Selecione a Criptomoeda</h3>
            <div className="space-y-3" data-testid="buy-crypto-list">
              {cryptos.map((crypto) => (
                <Card
                  key={crypto.id}
                  className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedCrypto?.id === crypto.id ? 'ring-2 shadow-lg' : ''
                  }`}
                  style={{
                    borderColor: selectedCrypto?.id === crypto.id ? '#10B981' : 'transparent',
                    backgroundColor: selectedCrypto?.id === crypto.id ? '#F0FDF4' : 'white'
                  }}
                  onClick={() => setSelectedCrypto(crypto)}
                  data-testid={`buy-crypto-${crypto.symbol.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{crypto.icon}</div>
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: '#1E3A8A' }}>{crypto.symbol}</h4>
                        <p className="text-sm text-gray-600">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#10B981' }}>
                        R$ {crypto.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Purchase Form */}
          <div>
            <Card className="p-8 shadow-lg sticky top-24">
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#1E3A8A' }}>Detalhes da Compra</h3>
              
              {!selectedCrypto ? (
                <p className="text-gray-600 text-center py-12">Selecione uma criptomoeda para continuar</p>
              ) : (
                <form onSubmit={handleBuy} className="space-y-6">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedCrypto.icon}</span>
                      <div>
                        <p className="font-bold" style={{ color: '#1E3A8A' }}>{selectedCrypto.name}</p>
                        <p className="text-sm text-gray-600">{selectedCrypto.symbol}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Preço: <span className="font-semibold">R$ {selectedCrypto.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-gray-700 font-medium">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="any"
                      min="0.00000001"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="mt-1.5"
                      placeholder="0.00000000"
                      data-testid="buy-quantity-input"
                    />
                  </div>

                  {quantity && parseFloat(quantity) > 0 && (
                    <div className="p-6 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                      <p className="text-gray-600 mb-2">Total a pagar:</p>
                      <p className="text-3xl font-bold" style={{ color: '#10B981' }} data-testid="buy-total-amount">
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !quantity || parseFloat(quantity) <= 0}
                    className="w-full text-white font-semibold py-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: '#10B981' }}
                    data-testid="buy-confirm-button"
                  >
                    {loading ? 'Processando...' : 'Confirmar Compra'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCrypto;