'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      window.location.reload();
    }
  }

  return (
    <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-[140px] h-[90px] relative"> {/* ajusta o tamanho sem aumentar a div */}
          <Image
            src="/images/logo_amotur.png"
            alt="Logo AMOTUR"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="relative">
        {/* Botão de menu mobile */}
        <button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-black border-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu mobile */}
        {menuOpen && (
          <ul className="absolute top-16 right-0 w-56 bg-white shadow-lg flex flex-col items-start p-4 sm:hidden z-50">
            <li className="mb-2 w-full"><a href="#" className="block text-lg font-medium text-black">Início</a></li>
            <li className="mb-2 w-full"><a href="#" className="block text-lg font-medium text-black">Sobre</a></li>
            <li className="mb-2 w-full"><a href="#" className="block text-lg font-medium text-black">Contato</a></li>
            <li className="w-full mt-2">
              {loading ? null : role === 'admin' ? (
                <a onClick={logout} className="block text-lg font-medium text-black">Logout</a>
              ) : (
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-lg font-semibold w-full"
                  onClick={() => (window.location.href = '/login')}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        )}

        {/* Menu desktop */}
        <ul className="hidden sm:flex space-x-6 items-center">
          <li><a href="#" className="text-black hover:text-amber-500 font-medium text-lg">Início</a></li>
          <li><a href="#" className="text-black hover:text-amber-500 font-medium text-lg">Sobre</a></li>
          <li><a href="#" className="text-black hover:text-amber-500 font-medium text-lg">Contato</a></li>
          <li>
            {loading ? null : role === 'admin' ? (
              <a onClick={logout} className="text-black hover:text-red-500 font-medium text-lg cursor-pointer">Logout</a>
            ) : (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-lg font-semibold"
                onClick={() => (window.location.href = '/login')}
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
