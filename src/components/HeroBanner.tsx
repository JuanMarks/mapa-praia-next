'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Image from 'next/image'; // 1. Importe o componente Image
import Header from './Header';

export default function HeroBanner() {
  return (
    <motion.section
      className="relative w-full h-[60vh]" // O contêiner precisa ser relativo
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* 2. Use o componente Image para o fundo */}
      <Image
        src="/images/img_icarai1.jpg" // O caminho continua o mesmo (relativo à pasta `public`)
        alt="Vista panorâmica da praia de Icaraí de Amontada"
        fill // 'fill' faz a imagem preencher o contêiner pai
        style={{ objectFit: 'cover', objectPosition: 'center 80%' }} // Substitui bg-cover e bg-position
        quality={80} // Opcional: ajusta a qualidade da imagem
        priority // Opcional: carrega a imagem prioritariamente (bom para imagens "hero")
      />
      <Header/>

      {/* Camada de sobreposição e conteúdo */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/50 px-4 text-center">
        <motion.h1
          className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Descubra o melhor de <span className='text-orange-500'>Amontada</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg text-white drop-shadow-md md:text-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Explore trilhas, restaurantes, praias e tudo que nossa região tem de melhor direto no seu mapa interativo.
        </motion.p>
        <motion.a
          href="#map"
          className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-orange-600"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Explorar o Mapa
        </motion.a>
      </div>
    </motion.section>
  );
}