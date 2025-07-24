'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
import api from '@/axios/config'; // Seu cliente Axios
import Image from 'next/image';
import Link from 'next/link';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await api.post('/auth/login', { email, password });
            
            console.log("Login bem-sucedido:", res.data);
            Cookies.set('token', res.data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
            Cookies.set('role', res.data.user.role, { expires: 1, secure: true, sameSite: 'strict' });
            Cookies.set('username', res.data.user.name, { expires: 1, secure: true, sameSite: 'strict' });
            
            router.push('/'); // Redireciona para a página principal
            
        } catch (err: unknown) {
            console.error("Erro detalhado no login:", err);
            
            let errorMessage = 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.';

            if (isAxiosError(err)) {
                if (err.response) {
                    const status = err.response.status;
                    const serverMessage = err.response.data?.message;

                    switch (status) {
                        case 401:
                        case 403:
                            errorMessage = 'Email ou senha incorretos. Por favor, verifique seus dados.';
                            break;
                        case 404:
                            errorMessage = 'O serviço de autenticação não foi encontrado. Por favor, contate o suporte.';
                            break;
                        case 500:
                            errorMessage = 'Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.';
                            break;
                        default:
                            errorMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage || 'Ocorreu um erro ao tentar fazer o login.';
                            break;
                    }
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            setIsLoading(true); // Opcional: pode ter um estado de loading separado para Google
            setError(null);
            try {
                const res = await api.post('/auth/google', { token: credentialResponse.credential });
                
                console.log("Login com Google bem-sucedido:", res.data);
                Cookies.set('token', res.data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
                Cookies.set('role', res.data.user.role, { expires: 1, secure: true, sameSite: 'strict' });
                Cookies.set('username', res.data.user.name, { expires: 1, secure: true, sameSite: 'strict' });
                
                router.push('/');
            } catch (err) {
                console.error("Erro no login com Google:", err);
                setError("Falha ao autenticar com o Google. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center pb-17">
            <div className="absolute inset-0 bg-blue-950/40"></div>
            <Image
                src="/images/icaraizinho2.jpeg"
                alt="Praia de Icaraizinho de Amontada"
                fill 
                className="object-cover -z-10"
                quality={85}
            />
            <div className="relative w-full max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-white text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
                        Explore, descubra & viva.
                    </h1>
                    <p className="mt-4 inline-block text-xl font-semibold drop-shadow-md">
                        Faça seu login →
                    </p>
                </div>
                <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
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
                            <div className="bg-red-200 border border-red-400 text-red-800 p-3 rounded-md">
                                <p className="text-sm font-semibold text-center">{error}</p>
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm text-blue-900 font-bold">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu email"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900/70 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-blue-900 font-bold">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900/70 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        <div className="text-right text-sm">
                            <Link href="#" className="font-medium text-blue-900 hover:text-blue-600">
                                Esqueceu sua senha?
                            </Link>
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

                    {/* Separador "OU" */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gray-100 px-3 text-gray-500 font-semibold">OU</span>
                        </div>
                    </div>

                    {/* Botão de Login com Google */}
                    <div className="mt-6 flex justify-center">
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => setError("Falha ao autenticar com o Google.")}
                                // Adicione props para personalizar o botão do Google se necessário
                                // Por exemplo, 'theme="filled_blue"', 'size="large"', 'text="continue_with"'
                                // Para combinar com o estilo profissional:
                                theme="outline" // 'outline' ou 'filled_blue'
                                size="large" // 'large', 'medium', 'small'
                                text="continue_with" // 'signin_with', 'signup_with', 'continue_with'
                                width="300" // Largura personalizada para o botão
                            />
                        </GoogleOAuthProvider>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-blue-900 font-bold">
                            Novo usuário?{' '}
                            <Link href="/register" className="font-bold text-blue-900 underline hover:underline">
                                Registre-se Aqui
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}