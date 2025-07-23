'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import {
  FaMapMarkerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaPhone,
  FaInfoCircle
} from 'react-icons/fa';

export default function MobileBottomBar() {
  const { role, loading } = useAuth();

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      window.location.href = '/';
    }
  }

  if (loading) return null;

  return (
    <>
      {/* Barra inferior fixa no mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 sm:hidden z-[1001]">
        <ul className="flex justify-around items-center h-16">
          <li className="flex-1">
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900"
            >
              <FaMapMarkerAlt size={20} />
              <span className="text-xs mt-1">Explorar</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link
              href="/contato"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-900"
            >
              <FaPhone size={20} />
              <span className="text-xs mt-1">Contato</span>
            </Link>
          </li>
          <li className="flex-1">
            <Link
              href="/sobre"
              className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-900"
            >
              <FaInfoCircle size={20} />
              <span className="text-xs mt-1">Sobre</span>
            </Link>
          </li>
          <li className="flex-1">
            {role ? (
              <button
                onClick={logout}
                className="flex flex-col items-center justify-center text-red-600 hover:text-red-800"
              >
                <FaSignOutAlt size={20} />
                <span className="text-xs mt-1">Sair</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-900"
              >
                <FaSignInAlt size={20} />
                <span className="text-xs mt-1">Login</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* Dashboard (apenas para admin) */}
      {role === 'admin' && (
        <div className="fixed bottom-20 right-4 sm:hidden z-[1002]">
          <Link
            href="/pageadmin"
            className="bg-blue-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
          >
            Dashboard
          </Link>
        </div>
      )}

      {/* Logo fixa no canto inferior esquerdo */}
      <div className="fixed bottom-20 left-4 sm:hidden z-[1002]">
        <Image
          src="/images/logo_amoturOFC.png" // ajuste o caminho conforme seu projeto
          alt="Logo AMOTUR"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    </>
  );
}
