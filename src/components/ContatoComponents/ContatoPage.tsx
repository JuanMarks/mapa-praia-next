'use client';

import React, { useState } from 'react';

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
      setErrorMessage('Ocorreu um erro ao tentar enviar a mensagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-16 bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 md:max-w-3/5 max-w-full">
        <div className="w-full bg-gradient-to-r from-cyan-200 to-sky-500 p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl dark:from-blue-600 dark:to-blue-800">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8 drop-shadow-md">
            Entre em Contato
          </h2>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {(Object.keys(formData) as FormField[]).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-semibold text-white mb-1">
                  {field === 'empresa' ? 'Empresa *' :
                   field === 'phone' ? 'Número de Telefone *' :
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
                    className="w-full px-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                  />
                ) : (
                  <textarea
                    id={field}
                    
                    name={field}
                    rows={6}
                    placeholder="Como podemos te ajudar?"
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full max-h-25 resize-none px-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                  ></textarea>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-103 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-700"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
