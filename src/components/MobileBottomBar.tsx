'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { FaMapMarkerAlt, FaSignInAlt, FaSignOutAlt, FaPhone, FaInfoCircle} from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { role, loading } = useAuth();

  function logout() {
    if (typeof window !== 'undefined') {
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      window.location.href = '/';
    }
  }

  if (loading) return null;

  const navItems = [
    {
      href: '/',
      label: 'Explorar',
      icon: <FaMapMarkerAlt size={20} />
    },
    {
      href: '/contato',
      label: 'Contato',
      icon: <FaPhone size={20} />
    },
    {
      href: '/sobre',
      label: 'Sobre',
      icon: <FaInfoCircle size={22} />
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Barra inferior fixa no mobile */}
      <nav className="fixed bottom-0 left-0 w-full  bg-white border-t border-gray-200 sm:hidden z-[1001]">
        <ul className="grid grid-cols-4 text-center h-16">
          {navItems.map(({ href, label, icon }) => (
            <li
              key={href}
              className={`flex flex-col items-center justify-center ${
                isActive(href) ? 'bg-blue-900/10 border-b-4 border-blue-900' : ''
              }`}
            >
              <Link href={href} className="flex flex-col items-center text-blue-900 hover:text-blue-900 h-full w-full justify-center">
                {icon}
                <span className="text-xs mt-1">{label}</span>
              </Link>
            </li>
          ))}

          {/* Item de Login/Sair - REMOVIDAS AS CLASSES 'isActive' DO LI */}
          <li className="flex flex-col items-center justify-center"> {/* Removido isActive(...) daqui */}
            {role ? ( // Se o usuário está logado, mostra "Sair"
              <button
                onClick={logout}
                className="flex flex-col items-center justify-center h-full w-full
                           text-blue-900" // Removido `isActive('/') ? 'bg-blue-900/10' : ''`
              >
                <FaSignOutAlt size={20} />
                <span className="text-xs mt-1">Sair</span>
              </button>
            ) : ( // Se não está logado, mostra "Login"
              <Link
                href="/login"
                className={`flex flex-col items-center justify-center h-full w-full
                            text-blue-900 hover:text-blue-900 ${
                              // Mantém o text-blue-900 apenas para o estado ativo do próprio link de login
                              isActive('/login') ? 'text-blue-900 bg-blue-900/10 border-b-4 rounded-t-2xl border-blue-900' : '' // Aplicado ao Link/Botão diretamente
                            }`}
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
        <div className="absolute bottom-11 right-5 sm:hidden z-[1002]">
          <Link href="/pageadmin" className="sm:hidden bg-white rounded-full h-12 w-12
    flex items-center justify-center shadow-lg">
            <span className='text-gray-700'><FaPencil size={20}/></span>
          </Link>
        </div>
      )}
    </>
  );
}