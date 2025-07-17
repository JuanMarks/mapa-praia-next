'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Usar o Link do Next.js é uma boa prática
import { useAuth } from '../../hooks/useAuth';

export default function Header2() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  function logout() {
    if (typeof window !== 'undefined') {
      // Remove os cookies de autenticação
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      // Redireciona para a página inicial, que irá recarregar o estado
      window.location.href = '/'; 
    }
  }

  // Componente para os botões de ação, para evitar repetição de código
  const ActionButtons = ({ isMobile = false }) => {
    if (loading) {
      return null; // Não mostra nada enquanto carrega
    }

    // Se o usuário tem uma "role" (está logado)
    if (role) {
      return (
        <>
          {/* O botão 'Editar' só aparece se a role for 'admin' */}
          {role === 'admin' && (
            <li className={isMobile ? 'w-full mb-2' : ''}>
              <Link href="/pageadmin" className={isMobile ? 'block text-lg font-medium bg-blue-900 text-white hover:bg-blue-600 rounded-lg text-center py-2' : "text-white rounded-lg px-5 py-2 font-semibold bg-blue-900 hover:bg-blue-700 text-lg"}>
                Editar
              </Link>
            </li>
          )}
          {/* O botão 'Sair' aparece para qualquer usuário logado (admin ou user) */}
          <li className={isMobile ? 'w-full' : ''}>
            <button onClick={logout} className={isMobile ? 'block text-lg font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg text-center py-2 w-full' : "text-white hover:bg-red-700 px-5 bg-red-600 rounded-lg py-2 font-semibold text-lg cursor-pointer"}>
              Sair
            </button>
          </li>
        </>
      );
    }

    // Se não está logado, mostra o botão de Login
    return (
      <li>
        <Link href="/login" className="bg-blue-900 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-lg font-semibold">
          Login
        </Link>
      </li>
    );
  };

  return (
    <header //-------> Z diminuido
      className={`z-[999] absolute top-2 left-1/2 -translate-x-1/2 w-full max-w-7xl
        bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-2xl shadow-lg
        flex flex-row items-center justify-between
        sm:flex-row sm:items-center sm:justify-between
        ${menuOpen ? 'sm:flex-row flex-col  ' : ''}`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link 
        href="/"
        className="w-[140px] h-[60px] relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
          <Image
            src={hovered ? '/images/logo_amotur.png' : '/images/logoAmotur-branco.png'}
            alt="Logo AMOTUR"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>
      </div>

      {/* Navegação */}
      <nav className="relative flex items-center">
        {/* Botão de menu mobile */}
        <button
          className="sm:hidden flex items-center px-3 py-2 border rounded text-white border-white ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu mobile */}
        {menuOpen && (
          <ul className="absolute top-16 right-0 w-56 z:[5002] bg-white text-black shadow-lg flex flex-col items-start p-4 sm:hidden rounded-2xl border border-gray-200">
            <li className="mb-2 w-full"><Link href="/" className="block text-lg font-medium">Início</Link></li>
            <li className="mb-2 w-full"><Link href="/sobre" className="block text-lg font-medium">Sobre</Link></li>
            <li className="mb-4 w-full"><Link href="/contato" className="block text-lg font-medium">Contato</Link></li>
            <hr className="w-full mb-4"/>
            <ActionButtons isMobile={true} />
          </ul>
        )}

        {/* Menu desktop */}
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
  );
}