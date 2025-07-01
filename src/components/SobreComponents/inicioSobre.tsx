import React from 'react'

export default function InicioSobre() {
  const imageName = 'praiasobre.jpg'
  const imagePath = `/images/${imageName}`

  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-cover bg-[position:center_bottom] flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-white text-center">
        <h1 className="sm:text-4xl text-[25px] px-8 font-bold">
          A AmoTur tem um propósito simples: tornar o turismo mais prático, acessível e repleto de experiências memoráveis.
        </h1>
      </div>
    </div>
  );
}
