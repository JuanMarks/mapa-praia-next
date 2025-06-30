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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl shadow-lg flex justify-between items-center z-50">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-[140px] h-[60px] relative"> {/* ajusta o tamanho sem aumentar a div */}
          <Image
            src="/images/logo_amotur2.png"
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
          <ul className=" z-[5000] absolute top-16 right-0 w-56 bg-white shadow-lg flex flex-col items-start p-4 sm:hidden rounded-2xl border border-gray-200">
            <li className="mb-2 w-full"><a href="/" className="block text-lg font-medium text-black">Início</a></li>
            <li className="mb-2 w-full"><a href="/sobre" className="block text-lg font-medium text-black">Sobre</a></li>
            <li className="mb-2 w-full"><a href="#" className="block text-lg font-medium text-black">Contato</a></li>
            <li className="w-full mt-2">
              {loading ? null : role === 'admin' ? (
                <>
                  <a onClick={logout} className="block text-lg font-medium text-black">Logout</a>
                  <a href='pageadmin' className="block text-lg font-medium text-black">Dashboard Admin</a>
                </>
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
        <ul className="hidden sm:flex space-x-6 items-center p-1">
          <li><a href="/" className="text-white hover:text-amber-500 font-medium text-lg">Início</a></li>
          <li><a href="/sobre" className="text-white hover:text-amber-500 font-medium text-lg">Sobre</a></li>
          <li><a href="#" className="text-white hover:text-amber-500 font-medium text-lg">Contato</a></li>
            {loading ? null : role === 'admin' ? (
              <>
                <li>
                  <a onClick={logout} className="text-white hover:text-amber-500 font-medium text-lg cursor-pointer">Logout</a>
                </li>
                <li>
                  <a href='pageadmin' className="block text-white  hover:text-amber-500 font-medium text-lg cursor-pointer">Dashboard Admin</a>
                </li>
              </>
            ) : (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-lg font-semibold"
                onClick={() => (window.location.href = '/login')}
              >
                Login
              </button>
              
            )}
          
        </ul>
      </nav>
    </header>
  );
}