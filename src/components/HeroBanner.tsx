'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function HeroBanner() {
  return (
    <motion.section
      className="relative w-full h-[60vh] bg-cover bg-[center_80%]"
      style={{ backgroundImage: "url('/images/img_icarai1.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Descubra o melhor de <span className='text-orange-500'>Amontada</span>
        </motion.h1>
        <motion.p
          className="text-white text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Explore trilhas, restaurantes, praias e tudo que nossa região tem de melhor direto no seu mapa interativo.
        </motion.p>
        <motion.a
          href="#map"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Explorar o Mapa
        </motion.a>
      </div>
    </motion.section>
  );
}
