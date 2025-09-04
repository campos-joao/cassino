'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: string;
  status: string;
  created_at: string;
}

interface Transaction {
  id: number;
  user_id: number;
  type: string;
  amount: string;
  description: string;
  status: string;
  created_at: string;
  user_name?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalBalance: number;
  totalTransactions: number;
  totalDeposits: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    totalDeposits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    loadDashboardData();
  }, [user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        
        // Calculate stats
        const totalUsers = usersData.users?.length || 0;
        const totalBalance = usersData.users?.reduce((sum: number, u: User) => 
          sum + parseFloat(u.balance || '0'), 0) || 0;
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          totalBalance
        }));
      }

      // Load transactions (simulate for now)
      // In a real app, you'd have an API endpoint for this
      setStats(prev => ({
        ...prev,
        totalTransactions: 150,
        totalDeposits: 45000
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: newStatus
        }),
      });

      if (response.ok) {
        // Reload users
        loadDashboardData();
      } else {
        alert('Erro ao atualizar status do usuário');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Erro ao atualizar status do usuário');
    }
  };

  const promoteUser = async (userId: number) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: 'admin'
        }),
      });

      if (response.ok) {
        loadDashboardData();
      } else {
        alert('Erro ao promover usuário');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Erro ao promover usuário');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie usuários, transações e monitore o sistema</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transações
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Saldo Total</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      R$ {stats.totalBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Transações</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💳</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Depósitos</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      R$ {stats.totalDeposits.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Novo usuário registrado</p>
                      <p className="text-sm text-gray-500">player@test.com se registrou</p>
                    </div>
                    <span className="text-sm text-gray-500">Há 2 horas</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Depósito realizado</p>
                      <p className="text-sm text-gray-500">R$ 100,00 depositados</p>
                    </div>
                    <span className="text-sm text-gray-500">Há 4 horas</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sistema iniciado</p>
                      <p className="text-sm text-gray-500">Banco de dados inicializado</p>
                    </div>
                    <span className="text-sm text-gray-500">Hoje</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gerenciamento de Usuários</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Jogador'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {parseFloat(user.balance || '0').toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Ativo' : 
                           user.status === 'suspended' ? 'Suspenso' : 'Banido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Ativar
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => promoteUser(user.id)}
                            className="text-red-600 hover:text-red-900 ml-2"
                          >
                            Promover
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Relatório de Transações</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios em Desenvolvimento</h3>
                <p className="text-gray-500">
                  Esta seção mostrará relatórios detalhados de transações, depósitos e saques.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Depósitos Hoje</h4>
                    <p className="text-2xl font-bold text-green-600">R$ 2.450,00</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Saques Hoje</h4>
                    <p className="text-2xl font-bold text-red-600">R$ 1.200,00</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Lucro Líquido</h4>
                    <p className="text-2xl font-bold text-blue-600">R$ 1.250,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
