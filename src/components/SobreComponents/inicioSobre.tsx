import React from 'react'

export default function InicioSobre() {
  const imageName = 'praiasobre.jpg'
  const imagePath = `/images/${imageName}`

  return (
    <div className="hidden relative w-full h-[30vh] overflow-hidden bg-cover bg-[position:center_bottom] md:flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
      <div className="absolute inset-0 bg-black/70 opacity-60 "></div>
      <div className="relative z-10 text-white text-center">
        <h1 className="sm:text-4xl text-[25px] px-6 font-bold pt-17">
          O Amotur tem um propósito simples: tornar o turismo mais prático, acessível e repleto de experiências memoráveis.
        </h1>
      </div>
    </div>
  );
}
