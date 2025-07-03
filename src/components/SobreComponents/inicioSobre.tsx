import React from 'react'

export default function InicioSobre() {
  const imageName = 'praiasobre.jpg'
  const imagePath = `/images/${imageName}`

  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-cover bg-[position:center_bottom] flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-white text-center">
        <h1 className="sm:text-4xl text-[25px] px-8 font-bold">
          O <span className='bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent font-extrabold drop-shadow'>Amotur</span> tem um propósito simples: tornar o turismo <span className='bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent font-extrabold drop-shadow'>mais prático</span>, <span className='bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent font-extrabold drop-shadow'>acessível</span> e repleto de <span className='bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent font-extrabold drop-shadow'>experiências memoráveis.</span>
        </h1>
      </div>
    </div>
  );
}
