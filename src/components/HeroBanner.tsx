'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Image from 'next/image';
import Header from './Header';

export default function HeroBanner() {
  return (
    <motion.section
      className="relative w-full h-[30vh] md:h-[30vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Image
        src="/images/img_icarai1.jpg"
        alt="Vista panorâmica da praia de Icaraí de Amontada"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center 80%' }}
        quality={80}
        priority
      />
      <Header />

      <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/30 px-6 text-center pt-16">
        <motion.h1
          className="text-xl font-extrabold text-white drop-shadow-lg sm:text-2xl md:text-4xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Do pôr do sol em <span className="text-blue-900">Icaraí</span> às águas calmas de <span className="text-blue-900">Moitas</span> e <span className="text-blue-900">Caetanos</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-sm text-white drop-shadow-md sm:text-base md:text-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Viva experiências únicas nas praias mais encantadoras do litoral cearense.
        </motion.p>
      </div>
    </motion.section>
  );
}
