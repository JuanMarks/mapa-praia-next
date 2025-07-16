// src/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';

export default function Header() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      window.location.href = '/';
    }
  }

  const ActionButtons = ({ isMobile = false }) => {
    if (loading) return null;

    if (role) {
      return (
        <>
          {role === 'admin' && (
            <li className={isMobile ? 'w-full mb-2' : ''}>
              <Link href="/pageadmin" className={isMobile ? 'block text-lg font-medium bg-blue-900 text-white hover:bg-blue-600 rounded-lg text-center py-2' : "text-white rounded-lg px-5 py-2 font-semibold bg-blue-900 hover:bg-blue-700 text-lg"}>
                Dashboard
              </Link>
            </li>
          )}
          <li className={isMobile ? 'w-full' : ''}>
            <button onClick={logout} className={isMobile ? 'block text-lg font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg text-center py-2 w-full' : "text-white hover:bg-red-700 px-5 bg-red-600 rounded-lg py-2 font-semibold text-lg cursor-pointer"}>
              Sair
            </button>
          </li>
        </>
      );
    }

    return (
      <li>
        <Link href="/login" className="bg-blue-900 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-lg font-semibold">
          Login
        </Link>
      </li>
    );
  };

  return (
    // 1. Contêiner Principal - Agora responsivo
    <div className="absolute left-5 top-[-10px] sm:top-0 sm:left-0 w-[calc(100%-2rem)] sm:w-auto pointer-events-none z-[5000]">
      <div className="relative w-full max-w-6xl sm:p-4 pointer-events-auto">
        
        {/* 2. Painel Deslizante - A animação é a mesma */}
        <div className={`
          transition-transform duration-500 ease-in-out
          ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
        `}>
          <header
            className="w-full bg-black/20 backdrop-blur-md px-6 py-2 shadow-lg flex flex-col sm:flex-row items-center justify-between rounded-2xl"
          >
            <div className="flex items-center justify-between w-full sm:w-auto">
              <Link href="/" className="w-[140px] h-[60px] relative">
                <Image
                  src="/images/logoAmotur-branco.png"
                  alt="Logo AMOTUR"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Link>
              <button
                className="sm:hidden ml-auto p-2 text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {menuOpen && (
              <ul className="w-full bg-white text-black shadow-lg flex flex-col items-start p-4 sm:hidden rounded-2xl border border-gray-200 mt-2">
                <li className="mb-2 w-full"><Link href="/" className="block text-lg font-medium">Início</Link></li>
                <li className="mb-2 w-full"><Link href="/sobre" className="block text-lg font-medium">Sobre</Link></li>
                <li className="mb-4 w-full"><Link href="/contato" className="block text-lg font-medium">Contato</Link></li>
                <hr className="w-full mb-4" />
                <ActionButtons isMobile={true} />
              </ul>
            )}

            <ul className="hidden sm:flex space-x-6 items-center ml-auto">
              <li><Link href="/" className="text-white hover:text-blue-200 font-medium ml-4 text-lg">Início</Link></li>
              <li><Link href="/sobre" className="text-white hover:text-blue-200 font-medium text-lg">Sobre</Link></li>
              <li><Link href="/contato" className="text-white hover:text-blue-200 font-medium text-lg">Contato</Link></li>
              <div className="flex items-center space-x-4 pl-4">
                <ActionButtons />
              </div>
            </ul>
          </header>
        </div>

        {/* 3. Botão Chevron - Posicionado de forma independente e correta */}
        <button
          onClick={() => setIsHeaderVisible(!isHeaderVisible)}
          className="
            absolute left-1/2 -translate-x-1/2 bg-white p-2 w-12 h-6
            shadow-lg focus:outline-none text-gray-700
            flex items-center justify-center rounded-b-xl z-[4999]
          "
          style={{ top: isHeaderVisible ? '80px' : '10px', transition: 'top 0.5s ease-in-out' }}
          aria-label={isHeaderVisible ? 'Esconder menu' : 'Mostrar menu'}
        >
          {isHeaderVisible ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
        </button>
      </div>
    </div>
  );
}