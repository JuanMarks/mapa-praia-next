import Image from 'next/image'


export default function QuemSomos() {
    return (
        <div className="flex flex-col lg:flex-row sm:mx-[80px] mx-[30px] my-[40px] gap-[30px]">
            <div className="lg:w-1/2 w-full">
                <h2 className="text-orange-500 font-bold sm:text-[30px] text-[25px]">Quem Somos?</h2>
                <p className="text-justify sm:text-[20px] text-[18px]">Somos uma iniciativa local, formada por jovens apaixonados pela nossa terra e com o desejo de compartilhar o que Amontada e suas praias têm de melhor. Conhecemos cada detalhe da nossa região e queremos ajudar você a viver experiências únicas, seja em roteiros culturais, passeios naturais ou descobertas que só quem é daqui sabe indicar. Você vai se encantar com Icaraizinho de Amontada, ideal para kitesurf, se surpreender com a tranquilidade das praias de Caetanos, e se apaixonar pelo pôr do sol mágico em Moitas.</p><br />
                <p className="text-justify sm:text-[20px] text-[18px]">Com a gente, o seu próximo destino fica mais perto do que você imagina. Bora viajar?</p>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center">
                <Image
                src="/images/icaraizinho.jpg"
                alt="Imagem do grupo"
                width={600}
                height={400}
                className="rounded-lg shadow-md w-full" 
                />
            </div>
        </div>
    )
}