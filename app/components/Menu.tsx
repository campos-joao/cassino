'use client';

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Menu() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  return (
    <header className="w-full flex justify-center items-center py-4 px-0 bg-gradient-to-b from-[#fff3f3] to-[#f6f6fa] sticky top-0 z-30">
      <div className="w-[95%] max-w-7xl bg-white rounded-full shadow flex items-center px-8 py-2 gap-8 border border-gray-200">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-red-600 tracking-tight">SUPERBET</span>
        </Link>
        {/* Menu central */}
        <nav className="flex-1 flex justify-center gap-6">
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Esportes</Link>
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Ao Vivo</Link>
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Supersocial</Link>
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Apostas</Link>
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Cassino</Link>
          <Link href="#" className="text-base font-semibold text-gray-800 hover:text-red-600 transition">Cassino Ao Vivo</Link>
        </nav>
        {/* Ações à direita */}
        <div className="flex items-center gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-4 py-2 font-semibold text-sm border border-gray-200 mr-2">Pesquisar</button>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-2 font-bold text-sm shadow transition"
              >
                <span>{user.name}</span>
                <span className="text-xs bg-green-800 px-2 py-1 rounded-full">
                  R$ {parseFloat(String(user.balance || '0')).toFixed(2)}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-sm font-bold text-green-600 mt-1">
                      Saldo: R$ {parseFloat(String(user.balance || '0')).toFixed(2)}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      href="/deposit" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Depositar
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Painel Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/register" className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-full px-5 py-2 font-semibold text-sm mr-2 transition">Registre-se</Link>
              <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-2 font-bold text-sm shadow transition">Entrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
