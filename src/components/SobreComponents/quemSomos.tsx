import Image from 'next/image'


export default function QuemSomos() {
    return (
        <div className="flex flex-col lg:flex-row sm:mx-[80px] mx-[20px] my-[40px] gap-[30px]">
            <div className="lg:w-1/2 w-full">
                <h2 className="text-blue-900 font-bold sm:text-[30px] text-[25px]">Quem Somos?</h2>
                <p className=" sm:text-[20px] text-[16px]">Somos uma iniciativa local, profundamente apaixonados pela nossa terra natal e com o sincero desejo de compartilhar o que Amontada e suas maravilhosas praias têm para oferecer. Conhecemos cada detalhe e segredo da nossa região, e nosso maior prazer é ajudar você a viver experiências verdadeiramente únicas, seja em roteiros culturais envolventes, passeios naturais inesquecíveis ou descobertas autênticas que só quem é daqui sabe indicar. Você vai se encantar profundamente com Icaraizinho de Amontada, um paraíso ideal para kitesurf, se surpreender com a tranquilidade serena das praias de Caetanos, e se apaixonar completamente pelo pôr do sol mágico e vibrante em Moitas.</p><br />
                <p className=" sm:text-[20px] text-[16px]">Com a gente, o seu próximo destino fica mais perto do que você imagina. Bora viajar?</p>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center">
                <Image
                src="/images/amotur e amontada valey.jpg"
                alt="Imagem do grupo"
                width={600}
                height={400}
                className="bg-cover rounded-lg shadow-md w-full" 
                />
            </div>
        </div>
    )
}