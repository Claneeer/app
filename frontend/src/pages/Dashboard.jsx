import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const Dashboard = ({ user, setUser }) => {
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, walletRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet')
      ]);
      setBalance(balanceRes.data.total_brl);
      setWallet(walletRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
        <Navbar user={user} setUser={setUser} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar user={user} setUser={setUser} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1E3A8A' }} data-testid="dashboard-title">
            Olá, {user.name}!
          </h1>
          <p className="text-gray-600">Bem-vindo à sua carteira de criptomoedas</p>
        </div>

        {/* Balance Card */}
        <Card className="p-8 mb-8 shadow-lg animate-slide-in" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Saldo Total
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white" data-testid="dashboard-balance">
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/buy')}
                className="bg-white hover:bg-gray-100 font-semibold px-6 py-6 rounded-lg flex items-center gap-2 transition-all duration-200"
                style={{ color: '#10B981' }}
                data-testid="dashboard-buy-button"
              >
                <ArrowDownRight className="w-5 h-5" />
                Comprar
              </Button>
              <Button
                onClick={() => navigate('/sell')}
                className="bg-white hover:bg-gray-100 font-semibold px-6 py-6 rounded-lg flex items-center gap-2 transition-all duration-200"
                style={{ color: '#EF4444' }}
                data-testid="dashboard-sell-button"
              >
                <ArrowUpRight className="w-5 h-5" />
                Vender
              </Button>
            </div>
          </div>
        </Card>

        {/* Wallet */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E3A8A' }}>Minha Carteira</h3>
        </div>

        {wallet.length === 0 ? (
          <Card className="p-12 text-center shadow-md" data-testid="dashboard-empty-wallet">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Sua carteira está vazia</p>
            <Button
              onClick={() => navigate('/buy')}
              className="text-white font-semibold px-8 py-5 rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#10B981' }}
              data-testid="dashboard-empty-buy-button"
            >
              Comprar Criptomoedas
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="dashboard-wallet-list">
            {wallet.map((item, index) => (
              <Card
                key={item.crypto_id}
                className="p-6 shadow-md hover:shadow-xl transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`wallet-item-${item.crypto_symbol.toLowerCase()}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold" style={{ color: '#1E3A8A' }}>
                      {item.crypto_symbol}
                    </h4>
                    <p className="text-sm text-gray-600">{item.crypto_name}</p>
                  </div>
                  <div className="text-3xl">{item.crypto_symbol === 'BTC' ? '₿' : item.crypto_symbol === 'ETH' ? 'Ξ' : item.crypto_symbol}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantidade:</span>
                    <span className="font-semibold" data-testid={`wallet-item-${item.crypto_symbol.toLowerCase()}-quantity`}>
                      {item.quantity.toFixed(8)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-semibold">
                      R$ {item.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ color: '#1E3A8A' }}>Total:</span>
                      <span className="font-bold text-lg" style={{ color: '#10B981' }} data-testid={`wallet-item-${item.crypto_symbol.toLowerCase()}-total`}>
                        R$ {item.total_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;