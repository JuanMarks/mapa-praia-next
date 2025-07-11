'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
// Importa os ícones de seta que usaremos no botão
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function Header() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // Novo estado para controlar a visibilidade do Header como um todo
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
                Editar
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
    // Container principal que posiciona o Header e o botão de toggle
    <div className="absolute top-4 left-20 z-[1001] flex items-center">
        {/* O Header em si, com a lógica de transição */}
        <header
            className={`transition-transform duration-500 ease-in-out w-full max-w-10xl 
            bg-black/20 backdrop-blur-md text-black px-6 py-2 rounded-2xl shadow-lg
            flex flex-row items-center justify-between
            ${isHeaderVisible ? 'translate-x-0' : '-translate-x-[110%]'}`}
        >
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/" className="w-[140px] h-[60px] relative">
                    <Image
                        src="/images/logoAmotur-branco.png"
                        alt="Logo AMOTUR"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>
            </div>

            {/* Navegação */}
            <nav className="relative flex items-center ml-6">
                <button
                    className="sm:hidden flex items-center px-3 py-2 border rounded text-white border-white ml-auto"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menu"
                >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {menuOpen && (
                    <ul className="absolute top-16 right-0 w-56 bg-white text-black shadow-lg flex flex-col items-start p-4 sm:hidden rounded-2xl border border-gray-200">
                        <li className="mb-2 w-full"><Link href="/" className="block text-lg font-medium">Início</Link></li>
                        <li className="mb-2 w-full"><Link href="/sobre" className="block text-lg font-medium">Sobre</Link></li>
                        <li className="mb-4 w-full"><Link href="/contato" className="block text-lg font-medium">Contato</Link></li>
                        <hr className="w-full mb-4"/>
                        <ActionButtons isMobile={true} />
                    </ul>
                )}

                <ul className="hidden sm:flex space-x-6 items-center">
                    <li><Link href="/" className="text-white hover:text-blue-900 font-medium text-lg">Início</Link></li>
                    <li><Link href="/sobre" className="text-white hover:text-blue-900 font-medium text-lg">Sobre</Link></li>
                    <li><Link href="/contato" className="text-white hover:text-blue-900 font-medium text-lg">Contato</Link></li>
                    <div className="flex items-center space-x-4 pl-4">
                        <ActionButtons />
                    </div>
                </ul>
            </nav>
        </header>

        {/* Botão para mostrar/esconder o Header */}
        <button
            onClick={() => setIsHeaderVisible(!isHeaderVisible)}
            className="bg-white p-2 rounded-full shadow-lg focus:outline-none z-10 text-gray-700 ml-2"
            aria-label={isHeaderVisible ? 'Esconder menu' : 'Mostrar menu'}
        >
            {isHeaderVisible ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
        </button>
    </div>
  );
}