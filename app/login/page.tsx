'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
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

    if (!email || !password) {
      setError('Todos os campos são obrigatórios');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/lobby');
    } else {
      setError(result.message || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar na sua conta</h1>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-yellow-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
