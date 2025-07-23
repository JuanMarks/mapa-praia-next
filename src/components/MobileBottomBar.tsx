'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { FaMapMarkerAlt, FaSignInAlt, FaSignOutAlt, FaPhone, FaInfoCircle} from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

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
        <ul className="grid grid-cols-4 text-center h-16">
          <li className="flex flex-col items-center justify-center">
            <Link href="/" className="flex flex-col items-center text-blue-700 hover:text-blue-900">
              <FaMapMarkerAlt size={20} />
              <span className="text-xs mt-1">Explorar</span>
            </Link>
          </li>
          <li className="flex flex-col items-center justify-center">
            <Link href="/contato" className="flex flex-col items-center text-gray-600 hover:text-blue-900">
              <FaPhone size={20} />
              <span className="text-xs mt-1">Contato</span>
            </Link>
          </li>
          <li className="flex flex-col items-center justify-center">
            <Link href="/sobre" className="flex flex-col items-center text-gray-600 hover:text-blue-900">
              <FaInfoCircle size={22} />
              <span className="text-xs mt-1">Sobre</span>
            </Link>
          </li>
          <li className="flex flex-col items-center justify-center">
            {role ? (
              <button
                onClick={logout}
                className="flex flex-col items-center text-red-600 hover:text-red-800"
              >
                <FaSignOutAlt size={20} />
                <span className="text-xs mt-1">Sair</span>
              </button>
            ) : (
              <Link href="/login" className="flex flex-col items-center text-gray-600 hover:text-blue-900">
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
          <Link href="/pageadmin" className="sm:hidden bg-white rounded-full h-12 w-12
    flex items-center justify-center shadow-lg">
            <FaPencil size={20}/>
          </Link>
        </div>
      )}
    </>
  );
}
