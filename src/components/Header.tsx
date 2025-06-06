import React from "react";
import { useAuth } from '../hooks/useAuth';
import image1 from '../../public/Gemini_Generated_Image_1nnkta1nnkta1nnk.png';


export default function Header(){
    const { role, loading } = useAuth();
    const [menuOpen, setMenuOpen] = React.useState(false);
    function logout() {
        if (typeof window !== 'undefined') {
            // Remove token from cookies
            document.cookie = 'token=; Max-Age=0; path=/;';
            window.location.reload();
        }
    }
    return(
        <header
            className="bg-black text-white py-4 px-6 flex items-center justify-between"
            style={{
                backgroundImage: `url(${image1.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >

        <h2 className=" font-bold">Mapa Praia</h2>
        <nav>
            <button
                className="sm:hidden flex items-center px-3 py-2 border rounded text-black border-black bg-white"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
            >
                <svg className="fill-current h-6 w-6" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
            {menuOpen && (
                <ul className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start p-4 sm:hidden z-50">
                    <li className="mb-2 w-full">
                        <a href="#" className="block text-black text-xl font-semibold hover:text-amber-200 w-full" style={{textDecoration: 'none'}}>
                            Início
                        </a>
                    </li>
                    <li className="mb-2 w-full">
                        <a href="#" className="block text-black text-xl font-semibold hover:text-gray-300 w-full" style={{textDecoration: 'none'}}>
                            Sobre
                        </a>
                    </li>
                    <li className="mb-2 w-full">
                        <a href="#" className="block text-black text-xl font-semibold hover:text-gray-300 w-full" style={{textDecoration: 'none'}}>
                            Contato
                        </a>
                    </li>
                    <li className="w-full">
                        {loading ? null : role === 'admin' ? (
                            <a href="#" className="block text-black text-xl font-semibold hover:text-gray-300 w-full" style={{textDecoration: 'none'}} onClick={logout}>
                                Logout
                            </a>
                        ) : (
                            <button
                                className="bg-blue-500 text-black text-xl font-semibold px-4 py-2 rounded w-full text-left"
                                onClick={() => {
                                    window.location.href = '/login';
                                }}
                            >
                                Login
                            </button>
                        )}
                    </li>
                </ul>
            )}
            <ul className="space-x-6 items-center hidden sm:flex" >
                <li>
                    <a href="#" className="text-black text-xl font-semibold hover:text-amber-200 transition-colors" style={{textDecoration: 'none'}}>
                        Início
                    </a>
                </li>
                <li>
                    <a href="#" className="text-black text-xl font-semibold hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}>
                        Sobre
                    </a>
                </li>
                <li>
                    <a href="#" className="text-black text-xl font-semibold hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}>
                        Contato
                    </a>
                </li>
                <li>
                    {loading ? null : role === 'admin' ? (
                        <a href="#" className=" text-black text-xl font-semibold hover:text-gray-300 transition-colors" style={{textDecoration: 'none'}}  onClick={logout}>
                            Logout
                        </a>
                    ) : (
                        <button
                            className="bg-blue-500 text-black text-xl font-semibold px-4 py-2 rounded "
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