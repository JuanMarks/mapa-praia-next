import React from "react";
import { useAuth } from '../hooks/useAuth';



export default function Header(){
    const { role, loading } = useAuth();
    function logout() {
        if (typeof window !== 'undefined') {
            // Remove token from cookies
            document.cookie = 'token=; Max-Age=0; path=/;';
            window.location.reload();
        }
    }
    return(
        <header className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <h2 className=" font-bold">Mapa Praia</h2>
        <nav>
            <ul className="flex space-x-6 items-center" >
                <li>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}>
                        Início
                    </a>
                </li>
                <li>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}>
                        Sobre
                    </a>
                </li>
                <li>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}>
                        Contato
                    </a>
                </li>
                <li>
                    {loading ? null : role === 'admin' ? (
                        <a href="#" className=" text-white hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}  onClick={logout}>
                            Logout
                        </a>
                    ) : (
                        <button
                            className="bg-blue-500 text-black px-4 py-2 rounded "
                            onClick={() => {
                                window.location.href = '/login';
                            }}
                        >
                            Login
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    </header>
    )
}