'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import {
  FaMapMarkerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaPhone,
  FaInfoCircle
} from 'react-icons/fa';

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
      <nav className="fixed bottom-0 left-0 w-full rounded-t-2xl bg-white border-t border-gray-200 sm:hidden z-[1001]">
        <ul className="grid grid-cols-4 text-center h-16">
          {navItems.map(({ href, label, icon }) => (
            <li
              key={href}
              className={`flex flex-col items-center justify-center ${
                isActive(href) ? 'bg-blue-900/10 border-b-4 rounded-t-2xl border-blue-900' : ''
              }`}
            >
              <Link href={href} className="flex flex-col items-center text-blue-900 hover:text-blue-900">
                {icon}
                <span className="text-xs mt-1">{label}</span>
              </Link>
            </li>
          ))}

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
              <Link
                href="/login"
                className={`flex flex-col items-center text-blue-900 hover:text-blue-900 ${
                  isActive('/login') ? 'bg-blue-900/40' : ''
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
        <div className="fixed bottom-20 right-4 sm:hidden z-[1002]">
          <Link
            href="/pageadmin"
            className="bg-blue-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
          >
            Dashboard
          </Link>
        </div>
      )}
    </>
  );
}
