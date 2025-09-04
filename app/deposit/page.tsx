'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const { user, loading, updateBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [paymentReference, setPaymentReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const paymentMethods = [
    { value: 'pix', label: 'PIX', icon: '📱' },
    { value: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
    { value: 'debit_card', label: 'Cartão de Débito', icon: '💳' },
    { value: 'bank_transfer', label: 'Transferência Bancária', icon: '🏦' },
    { value: 'crypto', label: 'Criptomoeda', icon: '₿' }
  ];

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const depositAmount = parseFloat(amount);

    // Validation
    if (!amount || isNaN(depositAmount) || depositAmount <= 0) {
      setError('Por favor, insira um valor válido');
      setIsLoading(false);
      return;
    }

    if (depositAmount < 10) {
      setError('Valor mínimo para depósito é R$ 10,00');
      setIsLoading(false);
      return;
    }

    if (depositAmount > 10000) {
      setError('Valor máximo para depósito é R$ 10.000,00');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: depositAmount,
          payment_method: paymentMethod,
          payment_reference: paymentReference || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Depósito de R$ ${depositAmount.toFixed(2)} processado com sucesso!`);
        updateBalance(data.new_balance);
        setAmount('');
        setPaymentReference('');
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError(data.message || 'Erro ao processar depósito');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Fazer Depósito</h1>
        
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-8">
          <h2 className="text-lg font-semibold mb-2">Saldo Atual</h2>
          <div className="text-3xl font-bold">R$ {parseFloat(String(user.balance || '0')).toFixed(2)}</div>
        </div>

        {/* Deposit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Informações do Depósito</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Valores Rápidos
              </label>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    R$ {quickAmount}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Depósito (R$)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0,00"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-600 mt-1">
                Mínimo: R$ 10,00 | Máximo: R$ 10.000,00
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Método de Pagamento
              </label>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <span className="font-medium text-gray-800">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Reference (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referência do Pagamento (Opcional)
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Chave PIX, número do cartão, etc."
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !amount}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processando...' : 'Confirmar Depósito'}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔒 Segurança</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Todas as transações são criptografadas</li>
              <li>• Seus dados financeiros estão protegidos</li>
              <li>• Depósitos são processados instantaneamente</li>
              <li>• Suporte 24/7 disponível</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
