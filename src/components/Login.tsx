'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://25.20.79.62:3003/auth/login', { email, senha });
      console.log(res.data.token.role);
      Cookies.set('token', res.data.token);
      Cookies.set('role', res.data.token.role);
      router.push('/'); // redireciona pro mapa ou dashboard
    } catch (err) {
      alert('Erro ao fazer login');
    }
  };


  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 position-relative bg-dark">
      {/* Botão de Voltar */}
      <button
        className="btn btn-outline-primary position-absolute top-0 start-0 m-3"
        onClick={() => router.push('/')}
      >
        ← Voltar ao mapa
      </button>

      {/* Card de login */}
      <div className="card shadow p-4" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
