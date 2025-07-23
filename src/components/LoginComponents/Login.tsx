'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
import api from '@/axios/config'; // Seu cliente Axios
import Image from 'next/image';
import Link from 'next/link';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { HiArrowLeft } from "react-icons/hi";

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

            // Verifica se é um erro do Axios para acessar detalhes da resposta
            if (isAxiosError(err)) {
                if (err.response) {
                    // Erros com resposta do servidor (ex: 401, 404, 500)
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
                            // Usa a mensagem do servidor se existir, senão uma mensagem genérica
                            errorMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage || 'Ocorreu um erro ao tentar fazer o login.';
                            break;
                    }
                }
                // Não é necessário o 'else', pois a mensagem padrão de erro de rede já foi definida.
            } else if (err instanceof Error) {
                // Para outros tipos de erro (não-Axios)
                errorMessage = err.message;
            }

            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        // credentialResponse.credential é o ID Token que você envia para o backend
        if (credentialResponse.credential) {
            setIsLoading(true);
            setError(null);
            try {
                // Envia o token para o seu backend NestJS
                const res = await api.post('/auth/google', { token: credentialResponse.credential });
                
                // Salva o token e os dados do usuário, assim como no login normal
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
        <div className="relative min-h-screen w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-950/40"></div>
            <a href="/" className='absolute p-1.5 md:hidden bg-blue-900 rounded top-2.5 left-2.5 text-white'><HiArrowLeft size={20}/></a>
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

                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => setError("Falha ao autenticar com o Google.")}
                            />
                        </GoogleOAuthProvider>

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