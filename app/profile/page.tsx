'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types/user';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'win':
      case 'bonus':
        return 'text-green-600';
      case 'bet':
      case 'withdrawal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↗️';
      case 'withdrawal':
        return '↙️';
      case 'bet':
        return '🎲';
      case 'win':
        return '🏆';
      case 'bonus':
        return '🎁';
      default:
        return '💰';
    }
  };

  const formatTransactionType = (type: string) => {
    const types: { [key: string]: string } = {
      deposit: 'Depósito',
      withdrawal: 'Saque',
      bet: 'Aposta',
      win: 'Ganho',
      bonus: 'Bônus'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome</label>
                  <p className="text-lg text-gray-800">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg text-gray-800">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Conta</label>
                  <p className="text-lg text-gray-800 capitalize">
                    {user.role === 'admin' ? 'Administrador' : 'Jogador'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Saldo da Conta</h2>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="text-3xl font-bold mb-2">
                  R$ {parseFloat(String(user.balance || '0')).toFixed(2)}
                </div>
                <p className="text-green-100">Saldo disponível</p>
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => router.push('/deposit')}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Depositar
                  </button>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors">
                    Sacar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Histórico de Transações</h2>
          
          {loadingTransactions ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Carregando transações...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Nenhuma transação encontrada</div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {formatTransactionType(transaction.type)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'bet' || transaction.type === 'withdrawal' ? '-' : '+'}
                      R$ {transaction.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluído' : 
                       transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
