import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const History = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/transactions/history');
      setTransactions(response.data);
    } catch (error) {
      toast.error('Erro ao carregar histórico');
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
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-gray-200 transition-colors"
          data-testid="history-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#1E3A8A' }} data-testid="history-title">
          Histórico de Transações
        </h1>

        {transactions.length === 0 ? (
          <Card className="p-12 text-center shadow-md" data-testid="history-empty">
            <p className="text-gray-600 mb-4">Você ainda não realizou nenhuma transação</p>
            <Button
              onClick={() => navigate('/buy')}
              className="text-white font-semibold px-8 py-5 rounded-lg"
              style={{ backgroundColor: '#10B981' }}
              data-testid="history-empty-buy-button"
            >
              Começar a Investir
            </Button>
          </Card>
        ) : (
          <div className="space-y-4" data-testid="history-list">
            {transactions.map((transaction, index) => (
              <Card
                key={transaction.id}
                className="p-6 shadow-md hover:shadow-lg transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`transaction-${transaction.transaction_type}-${transaction.crypto_symbol.toLowerCase()}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.transaction_type === 'buy' ? '#D1FAE5' : '#FEE2E2'
                      }}
                    >
                      {transaction.transaction_type === 'buy' ? (
                        <ArrowDownRight className="w-6 h-6" style={{ color: '#10B981' }} />
                      ) : (
                        <ArrowUpRight className="w-6 h-6" style={{ color: '#EF4444' }} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: '#1E3A8A' }}>
                        {transaction.transaction_type === 'buy' ? 'Compra' : 'Venda'} de {transaction.crypto_symbol}
                      </h4>
                      <p className="text-sm text-gray-600">{transaction.crypto_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(transaction.timestamp), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">
                      Quantidade: <span className="font-semibold">{transaction.quantity.toFixed(8)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Preço: R$ {transaction.price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xl font-bold" style={{ color: transaction.transaction_type === 'buy' ? '#EF4444' : '#10B981' }}>
                      {transaction.transaction_type === 'buy' ? '-' : '+'} R$ {transaction.total_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
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

export default History;