'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/lobby');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await register(email, password, name);
    
    if (result.success) {
      router.push('/lobby');
    } else {
      setError(result.message || 'Erro ao criar conta');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar nova conta</h1>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
