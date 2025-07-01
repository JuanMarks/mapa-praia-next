'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      window.location.reload();
    }
  }

  return (
    <header className="absolute top-2 left-1/2 -translate-x-1/2 w-full max-w-7xl bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-2xl shadow-lg flex justify-between items-center z-40">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-[140px] h-[60px] relative">
          <Image
            src="/images/logo_amoturOFC.png"
            alt="Logo AMOTUR"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Menu */}
      <nav className="relative items-center">
        {/* Botão de menu mobile */}
        <button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-white border-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu mobile */}
        {menuOpen && (
          <ul className="z-[9999] absolute top-16 right-0 w-56 bg-white text-black shadow-lg flex flex-col items-start p-4 sm:hidden rounded-2xl border border-gray-200">
            <li className="mb-2 w-full">
              <a href="/" className="block text-lg font-medium">Início</a>
            </li>
            <li className="mb-2 w-full">
              <a href="/sobre" className="block text-lg font-medium">Sobre</a>
            </li>
            <li className="mb-2 w-full">
              <a href="#" className="block text-lg font-medium">Contato</a>
            </li>

            {loading ? null : role === 'admin' ? (
              <>
                <li className="mb-2 w-full">
                  <a onClick={logout} className="block text-lg font-medium cursor-pointer bg-blue-900 hover:bg-blue-600 rounded-lg  px-20">Sair</a>
                </li>
                <li className="w-full">
                  <a href="/pageadmin" className="block text-lg font-medium bg-blue-900 hover:bg-blue-600 rounded-lg px-18">Editar</a>
                </li>
              </>
            ) : (
              <li className="w-full mt-2">
                <button
                  className="bg-blue-900 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-lg font-semibold w-full"
                  onClick={() => (window.location.href = '/login')}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        )}

        {/* Menu desktop */}
        <ul className="hidden sm:flex space-x-6 items-center">
          <li><a href="/" className="text-white hover:text-blue-900 font-medium text-lg">Início</a></li>
          <li><a href="/sobre" className="text-white hover:text-blue-900 font-medium text-lg">Sobre</a></li>
          <li><a href="#" className="text-white hover:text-blue-900 font-medium text-lg">Contato</a></li>
          {loading ? null : role === 'admin' ? (
            <>
              <li>
                <a href="/pageadmin" className="text-white rounded-lg px-5 py-1 font-semibold bg-blue-900 hover:bg-blue-700 text-lg">Editar</a>
              </li>
              <li>
                <a onClick={logout} className="text-white hover:bg-blue-700 px-7 bg-blue-900 rounded-lg py-1 font-semibold text-lg cursor-pointer">Sair</a>
              </li>
            </>
          ) : (
            <button
              className="bg-blue-900 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-lg font-semibold"
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