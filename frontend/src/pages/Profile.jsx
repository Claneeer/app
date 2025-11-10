import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ArrowLeft, UserCircle, Trash2 } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {};
      if (name !== user.name) updateData.name = name;
      if (password) updateData.password = password;

      if (Object.keys(updateData).length === 0) {
        toast.info('Nenhuma alteração foi feita');
        setLoading(false);
        return;
      }

      const response = await api.put('/auth/update', updateData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/auth/delete');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Conta deletada com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao deletar conta');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar user={user} setUser={setUser} />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-gray-200 transition-colors"
          data-testid="profile-back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#1E3A8A' }} data-testid="profile-title">
          Meu Perfil
        </h1>

        <Card className="p-8 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <UserCircle className="w-16 h-16" style={{ color: '#1E3A8A' }} />
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1E3A8A' }} data-testid="profile-username">{user.name}</h2>
              <p className="text-gray-600" data-testid="profile-email">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5"
                data-testid="profile-name-input"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="mt-1.5 bg-gray-100"
                data-testid="profile-email-input"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="mt-1.5"
                placeholder="Deixe em branco para não alterar"
                data-testid="profile-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-6 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#10B981' }}
              data-testid="profile-update-button"
            >
              {loading ? 'Atualizando...' : 'Atualizar Perfil'}
            </Button>
          </form>
        </Card>

        <Card className="p-8 shadow-lg border-2" style={{ borderColor: '#FEE2E2' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#EF4444' }}>Zona de Perigo</h3>
          <p className="text-gray-600 mb-6">
            Ao deletar sua conta, todos os seus dados, transações e saldo serão permanentemente removidos. Esta ação não pode ser desfeita.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full sm:w-auto font-semibold py-5 px-8 rounded-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#EF4444' }}
                data-testid="profile-delete-trigger"
              >
                <Trash2 className="w-4 h-4" />
                Deletar Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Sua conta, transações e todos os dados serão permanentemente deletados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="profile-delete-cancel">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="profile-delete-confirm"
                >
                  Deletar Permanentemente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </div>
  );
};

export default Profile;