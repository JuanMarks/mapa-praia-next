'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/axios/config';
import Image from 'next/image';

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
        <div className="relative min-h-screen w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-950 opacity-60"></div>
            {/* Imagem de Fundo */}
            <Image
                src="/images/icaraizinho2.jpeg"
                alt="Praia de Icaraizinho de Amontada"
                fill 
                className="object-cover -z-10"
                quality={85}
            />

            <div className="relative w-full max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Coluna da Esquerda: Textos */}
                <div className="text-white text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
                        Explore, descubra & viva.
                    </h1>
                    <p className="mt-4 inline-block text-xl font-semibold drop-shadow-md">
                        Faça seu login →
                    </p>
                </div>

                {/* Coluna da Direita: Formulário de Login */}
                <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        {/* Use seu logo aqui, se tiver. Exemplo: */}
                        <Image 
                          src="/images/logo_amoturOFC.png" 
                          alt="Logo AMOTUR"
                          width={150}
                          height={60}
                          className="mx-auto"
                        />
                        
                        <p className="text-blue-900">Boas-vindas à nossa plataforma!</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-md">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm text-blue-900 font-bold">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu email"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-blue-900 font-bold">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>
                        
                        <div className="text-right text-sm">
                            <a href="#" className="font-medium text-blue-900 hover:text-blue-600">
                                Esqueceu sua senha?
                            </a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-900 hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Entrando...' : 'LOGIN'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-blue-900 font-bold">
                            Novo usuário?{' '}
                            <a href="#" className="font-bold text-blue-900 underline hover:underline">
                                Registre-se Aqui
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}