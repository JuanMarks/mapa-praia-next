'use client'; // Necessário para componentes interativos no App Router do Next.js 13+

import React, { useState } from 'react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empresa: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { name, email, empresa, phone, message } = formData;
    const emailTarget = "josenilsonsousa366@gmail.com";

    const body = `
    Olá, meu nome é ${name}.

    ${message}

    ----------------------------------------
    📩 Email: ${email}
    🏢 Empresa: ${empresa}
    📞 Telefone: ${phone}
    ----------------------------------------

    Atenciosamente,  
    ${name}
    `;

    const mailtoLink = `mailto:${emailTarget}?subject=${encodeURIComponent(`Contato de ${name} - ${empresa}`)}&body=${encodeURIComponent(body)}`;


    window.location.href = mailtoLink;

    // Opcional: Limpar o formulário após o envio
    setFormData({
      name: '',
      email: '',
      empresa: '',
      phone: '',
      message: '',
    });
  };

  return (
    // Seção de Contato com um fundo cinza claro e espaçamento vertical
    <section id="contato" className="py-16 bg-gray-100 flex items-center justify-center">
      {/* Container principal para centralizar e limitar a largura do formulário */}
      <div className="container mx-auto px-4 md:max-w-3/5 max-w-full">
        {/* Card do Formulário com gradiente e sombra aprimorada */}
        <div className="w-full
                       bg-gradient-to-r from-cyan-200 to-sky-500
                      p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl
                      dark:from-blue-600 dark:to-blue-800
                      ">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 drop-shadow-md">
            Entre em Contato
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white text-gray-800 placeholder-gray-500
                           rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                           transition duration-200 ease-in-out
                           "
              />
            </div>
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Seu Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white text-gray-800 placeholder-gray-500
                           rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-800
                           transition duration-200 ease-in-out
                           "
              />
            </div>
            {/* Campo Assunto */}
            <div>
              <label htmlFor="empresa" className="block text-sm font-semibold text-white mb-1">
                Empresa
              </label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                placeholder="Nome da sua empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white text-gray-800 placeholder-gray-500
                           rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                           transition duration-200 ease-in-out
                           "
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white mb-1">
                Número de Telefone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white text-gray-800 placeholder-gray-500
                           rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                           transition duration-200 ease-in-out
                           "
              />
            </div>
            {/* Campo Mensagem */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-white mb-1">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={6} // Aumentado para 6 linhas para mais espaço
                placeholder="Deixe Sua Mensagem"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full max-h-20 px-4 py-2 bg-white text-gray-800 placeholder-gray-500
                           rounded-lg shadow-sm resize-y
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                           transition duration-200 ease-in-out
                           "
              ></textarea>
            </div>
            {/* Botão de Envio */}
            <button
              type="submit"
              className="w-full
                         bg-gradient-to-r from-blue-800 to-blue-700 hover:bg-blue-900
                         text-white font-bold py-3 px-6 rounded-lg shadow-lg
                         transition duration-300 ease-in-out transform hover:scale-103
                         focus:outline-none focus:ring-3 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-700
                         "
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};