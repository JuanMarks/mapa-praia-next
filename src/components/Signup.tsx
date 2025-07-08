'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/axios/config';
import Image from 'next/image';
import Link from 'next/link'; // Importe o Link para navegação

export default function Register() {
    const router = useRouter();

    // 1. Estados para os novos campos do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // Estado para mensagem de sucesso
    const [isLoading, setIsLoading] = useState(false);

    // 2. Função de cadastro
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        
        const dados = { name, email, phone, password };

        try {
            // 3. Chame o endpoint de criação de usuário
            await api.post('/auth/register', dados); 
            
            setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');

            // Redireciona para a página de login após 2 segundos
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            console.error("Erro no cadastro:", err);
            const errorMessage = err.response?.data?.message || 'Não foi possível realizar o cadastro. Verifique seus dados.';
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
                        Crie sua conta para começar →
                    </p>
                </div>

                {/* Coluna da Direita: Formulário de Cadastro */}
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

                    {/* 4. Formulário aponta para handleRegister */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-200 border border-red-500 text-red-800 p-3 rounded-md">
                                <p className="text-sm font-medium text-center">{error}</p>
                            </div>
                        )}
                        {success && (
                             <div className="bg-green-200 border border-green-500 text-green-800 p-3 rounded-md">
                                <p className="text-sm font-medium text-center">{success}</p>
                            </div>
                        )}
                        
                        {/* Campo Nome */}
                        <div>
                            <label htmlFor="name" className="block text-sm text-blue-900 font-bold">
                                Nome Completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Digite seu nome completo"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>
                        
                        {/* Campo Email */}
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
                        
                        {/* Campo Telefone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm text-blue-900 font-bold">
                                Telefone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(99) 99999-9999"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm text-blue-900 font-bold">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Crie uma senha forte"
                                className="mt-1 block w-full bg-gray-300 text-blue-900 placeholder-blue-900 border-none rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-900 hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                            >
                                {isLoading ? 'Cadastrando...' : 'CADASTRAR'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-blue-900 font-bold">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="font-bold text-blue-900 underline hover:underline">
                                Faça Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}