'use client';
import React from 'react';
import Image from 'next/image';
import { FaGithub, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-white pb-20 sm:pb-3 py-5 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-700">
      
      {/* Logo à esquerda */}
      <div className="flex items-center gap-2">
        <div className="relative w-[140px] h-[60px]">
          <Image
            src="/images/logo_amoturOFC.png"
            alt="Logo AMOTUR"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Texto central */}
      <p className="text-center text-gray-600 flex-1">
        Explore as belezas naturais, pontos turísticos e serviços da nossa região com facilidade. Este mapa é feito para quem ama conhecer o melhor do nosso litoral.
      </p>

      {/* Botões com ícones */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/sobre"
          className="flex items-center gap-1 text-gray-700 border rounded-4xl border-gray-300 px-3 py-1.5  hover:bg-gray-100 transition"
        >
          <FaInfoCircle /> Sobre
        </Link>
        <Link
          href="/contato"
          className="flex items-center gap-1 bg-blue-900 text-white rounded-4xl px-3 py-1.5 hover:bg-blue-600 transition"
        >
          <FaEnvelope /> Contato
        </Link>
        <Link
          href="https://github.com/seu-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-4xl hover:bg-gray-100 transition"
        >
          <FaGithub /> GitHub
        </Link>
      </div>
    </footer>
  );
}