'use client';

import Image from 'next/image';
import React from 'react';
import { FaGithub, FaEnvelope, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-orange-600 shadow-lg py-4 px-6">
      <div className="flex md:flex-row items-center justify-between gap-4 transition-all">
        {/* Logo + Nome */}
        <div className="flex items-center gap-2">
          <div className="relative w-[70px] h-[35px]">
            <Image
              src="/images/logo_amotur_branca.png"
              alt="Logo BoraTur"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col md:flex-row gap-2 md:gap-6 text-center">
          {['Início', 'Sobre', 'Contato'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-white bg-black px-4 rounded hover:bg-white hover:text-black transition "
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Redes sociais */}
        <div className="flex gap-4">
          <a href="#" className="text-black hover:scale-125 transition-all">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-black hover:scale-125 transition-all">
            <FaEnvelope size={24} />
          </a>
          <a href="#" className="text-black hover:scale-125 transition-all">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
