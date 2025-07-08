

export default function BannerContato() {
    const imageName = 'praiasobre.jpg'
    const imagePath = `/images/${imageName}`

    return (
        <div className="relative w-full h-[300px] overflow-hidden bg-cover bg-[position:center_bottom] flex items-center justify-center" style={{ backgroundImage: `url('${imagePath}')` }}>
            {/*-------> imagem mais clara */}
            <div className="absolute inset-0 bg-black/70 opacity-60"></div> 
            <div className="relative z-10 text-white text-center">
                <h1 className="sm:text-4xl text-[26px] px-8 font-bold">
                <span className='bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent font-extrabold drop-shadow'>Vamos conversar!</span>
            </h1>
            <p className="md:text-2xl text-[16px] md:px-9 px-4">Se você tem alguma dúvida, proposta de projeto ou quer adicionar algum ponto em nosso mapa, sinta-se à vontade para nos contatar através do formulário a baixo.</p>
      </div>
    </div>
    )
}