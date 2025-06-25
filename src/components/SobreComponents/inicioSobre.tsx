

import React from 'react'

export default function InicioSobre() {
  const imageName = 'praiasobre.jpg'
  const imagePath = `/images/${imageName}`

  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-cover bg-[position:center_bottom] flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-white text-center">
        <h5 className="text-orange-500 text-start  sm:text-2xl text-18px pl-[60px] font-bold">Sobre Nós</h5>
        <h1 className="sm:text-4xl text-[25px] px-8 font-bold">
          A BoraTur nasceu com um propósito simples: tornar o turismo mais fácil, acessível e cheio de boas histórias para contar.
        </h1>
      </div>
    </div>
  );
}
