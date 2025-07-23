'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HiArrowLeft } from "react-icons/hi";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empresa: '',
    phone: '',
    message: '',
  });

  type FormField = keyof typeof formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

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

    try {
      window.location.href = mailtoLink;
      setSuccessMessage('Mensagem enviada com sucesso!');
      setFormData({ name: '', email: '', empresa: '', phone: '', message: '' });
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao tentar enviar a mensagem.'+ error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-17 sm:pb-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-blue-900/30"></div>
      <a href="/" className='absolute p-1.5 md:hidden bg-blue-900 rounded top-2.5 left-2.5 text-white'><HiArrowLeft size={20}/></a>

      <Image
        src="/images/icaraizinho2.jpeg"
        alt="Praia de Icaraizinho de Amontada"
        fill
        className="object-cover -z-10"
        quality={85}
      />

      <div className="relative w-full mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center">

        {/* Coluna da Esquerda */}
        <div className="text-white text-center md:text-left space-y-4 md:ml-28 md:w-2/3 px-3.5 mt-7">
          <h1 className="text-5xl mt-4 font-extrabold">Vamos Conversar!</h1>
          <p className="text-lg font-medium">
            Se você tem alguma dúvida, proposta de projeto ou quer adicionar algum ponto em nosso mapa,
            sinta-se à vontade para nos contatar através do formulário.
          </p>
          <p className="md:inline-block bg-blue-900 text-white font-semibold rounded-lg px-6 py-3 mt-4 hidden">
            Entre em contato →
          </p>
        </div>

        {/* Coluna da Direita */}
        <div id="formulario" className="bg-white rounded-2xl sm:rounded-tr-none sm:rounded-br-none rounded-tl-2xl md:rounded-bl-2xl md:h-screen p-10 shadow-2xl m-4 md:m-0">
          <div className="text-center mb-6">
            <Image
              src="/images/logo_amoturOFC.png"
              alt="Logo AMOTUR"
              width={150}
              height={60}
              className="mx-auto"
            />
          </div>

          {successMessage && (
            <div className="mb-2 p-3 bg-green-100 text-green-800 rounded-md text-center font-semibold">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md text-center font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {(Object.keys(formData) as FormField[]).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-semibold text-blue-900 mb-1">
                  {field === 'empresa' ? 'Empresa *' :
                    field === 'phone' ? 'Telefone *' :
                      field === 'message' ? 'Mensagem *' :
                        `${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                </label>

                {field !== 'message' ? (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    placeholder={
                      field === 'name' ? 'Digite seu nome completo' :
                        field === 'email' ? 'Digite seu email' :
                          field === 'empresa' ? 'Nome da sua empresa' :
                            field === 'phone' ? 'Telefone para contato' :
                              ''
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-200 text-blue-900 placeholder-blue-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                ) : (
                  <textarea
                    id={field}
                    name={field}
                    rows={3}
                    placeholder="Como podemos ajudar?"
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full resize-none px-4 py-2 bg-gray-200 text-blue-900 placeholder-blue-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  ></textarea>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
