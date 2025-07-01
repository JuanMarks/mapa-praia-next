import React from 'react'

export default function InicioSobre() {
  const imageName = 'praiasobre.jpg'
  const imagePath = `/images/${imageName}`

  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-cover bg-[position:center_bottom] flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-white text-center">
        <h5 className="text-orange-500 items-center sm:items-center sm:text-2xl text-18px pl-[60px] font-bold">Sobre Nós</h5>
        <h5 className="sm:text-2xl text-[15px] px-8 font-bold">
          A BoraTur nasceu com um propósito simples: tornar o turismo mais fácil,
          <br />
           acessível e cheio de boas histórias para contar.
        </h5>
      </div>
    </div>
  );
}
