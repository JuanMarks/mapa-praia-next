// src/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { IoChevronUp, IoChevronDown, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import LocationSearch from './RightSideBar';
import { PontoTuristico } from '@/types/ponto';

export default function Header() {
  const { role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<PontoTuristico | null>(null);

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      window.location.href = '/';
    }
  }

  const handleLocationSelect = (ponto: PontoTuristico) => {
    setSelectedLocation(ponto);
    console.log("Local selecionado no Header (via LocationSearch):", ponto);
    setMenuOpen(false);
  };

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
    // Esta div pai controla o posicionamento e o movimento de TODO o conjunto (navbar + botão de seta)
    // No desktop, ela agora terá margens laterais e será centralizada.
    // O `sm:w-full` foi removido daqui e a largura máxima e margens auto serão no header.
    <div className={`
      absolute top-4 left-4 z-[1001] w-[calc(100%-2rem)] flex flex-col items-center
      sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-4rem)] sm:flex-row sm:justify-between sm:items-center
      transition-transform duration-500 ease-in-out
      ${isHeaderVisible ? 'translate-y-0' : '-translate-y-[calc(100%-40px)]'}
      sm:${isHeaderVisible ? 'translate-x-0' : '-translate-x-[110%]'}
    `}>
      {/* O header em si - agora com largura máxima, centralização e bordas arredondadas no desktop */}
      <header
        className={`w-full bg-black/20 backdrop-blur-md text-black px-6 py-2 shadow-lg
        flex flex-col sm:flex-row items-start sm:items-center justify-between
        rounded-2xl sm:max-w-7xl sm:rounded-2xl sm:mx-auto`}
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
            <li className="w-full mb-4">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </li>
            <li className="mb-2 w-full"><Link href="/" className="block text-lg font-medium">Início</Link></li>
            <li className="mb-2 w-full"><Link href="/sobre" className="block text-lg font-medium">Sobre</Link></li>
            <li className="mb-4 w-full"><Link href="/contato" className="block text-lg font-medium">Contato</Link></li>
            <hr className="w-full mb-4" />
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
          <li className="hidden sm:block">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </li>
        </ul>
      </header>

      {/* Botão da seta - Posicionado abaixo no mobile, e no canto esquerdo redondo no desktop */}
      <button
        onClick={() => setIsHeaderVisible(!isHeaderVisible)}
        className="
          bg-white p-2 shadow-lg focus:outline-none text-gray-700
          mt-0.5 rounded-b-2xl w-16 text-center
          sm:ml-0 sm:mt-0 sm:rounded-full sm:w-auto sm:h-auto sm:px-3 sm:py-2
          sm:absolute sm:-left-12 sm:top-1/2 sm:-translate-y-1/2
        "
        aria-label={isHeaderVisible ? 'Esconder menu' : 'Mostrar menu'}
      >
        {isHeaderVisible ? (
          <>
            <span className="hidden sm:inline-block"><IoChevronBack size={20} /></span>
            <span className="sm:hidden"><IoChevronUp size={20} /></span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline-block"><IoChevronForward size={20} /></span>
            <span className="sm:hidden"><IoChevronDown size={20} /></span>
          </>
        )}
      </button>
    </div>
  );
}