'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/axios/config';

// Ícone de seta para o botão de voltar, para não depender de texto
const ArrowLeftIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
    </svg>
);

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const dados = { email, password };

        try {
            const res = await api.post('/auth/login', dados);
            
            Cookies.set('token', res.data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
            Cookies.set('role', res.data.user.role, { expires: 1, secure: true, sameSite: 'strict' });
            
            router.push('/'); // Redireciona para a página principal
        } catch (err: any) {
            console.error("Erro no login:", err);
            const errorMessage = err.response?.data?.message || 'E-mail ou senha inválidos. Tente novamente.';
            setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            {/* Botão de Voltar com estilo Tailwind */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Voltar para a página inicial"
            >
                <ArrowLeftIcon />
                <span className="hidden sm:inline">Voltar ao mapa</span>
            </button>

            <div className="w-full max-w-md space-y-8">
                {/* Cabeçalho */}
                <div>
                    {/* Você pode colocar seu logo aqui */}
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Acesse sua conta
                    </h2>
                </div>

                {/* Card do formulário */}
                <div className="rounded-2xl bg-white p-8 shadow-xl">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Exibição de Erro */}
                        {error && (
                            <div className="rounded-md border-l-4 border-red-500 bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-700">{error}</p>
                            </div>
                        )}
                        
                        {/* Campo de Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:blue-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Campo de Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:blue-orange-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Botão de Login */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}