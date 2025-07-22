'use client';

import { PontoTuristico } from '@/types/ponto';
import Image from 'next/image';

// Importando o Swiper e seus módulos
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Importando os estilos do Swiper
import 'swiper/css';
import 'swiper/css/pagination';

// Importando ícones
import { FaStar, FaMapMarkerAlt, FaBookmark, FaWheelchair } from 'react-icons/fa';


interface Props {
  ponto: PontoTuristico;
}

const PopupContent = ({ ponto }: Props) => {

  const temFotos = ponto.photos && ponto.photos.length > 0;

  return (
    // Card principal: largura reduzida de 320px para 192px (60%)
    <div className="w-[192px] rounded-xl overflow-hidden font-sans z-[5000]">
      
      {/* Seção do Carrossel: altura reduzida de h-48 para h-28 (aprox. 60%) */}
      <div className="relative h-28">
        {temFotos ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {ponto.photos?.map((url, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={`${url}`} // Substitua pela URL correta se necessário
                  alt={`Foto de ${ponto.name} ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="192px" // Tamanho da imagem atualizado
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Image
            src="/images/img1.jpeg" 
            alt="Imagem padrão do local"
            fill
            style={{ objectFit: 'cover' }}
            sizes="192px" // Tamanho da imagem atualizado
          />
        )}
      </div>

      {/* Seção de Informações: padding reduzido de p-4 para p-2.5 */}
      <div className="p-2.5">
        <div className="flex justify-between items-start">
          <div>
            {/* Título: fonte reduzida de text-lg para text-base */}
            <h3 className="font-bold text-base text-gray-800">{ponto.name}</h3>
            
            {/* Demais textos: fonte reduzida de text-sm para text-xs */}
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <FaStar className="text-yellow-500 mr-1" />
              <span>4,9</span>
              <span className="ml-1.5">(7)</span>
            </div>

            <div className="flex items-center text-xs text-gray-600 mt-1">
              <span>Quadra</span>
              <FaWheelchair className="ml-1.5" />
            </div>

            <p className="text-xs mt-1">
              <span className="text-green-600 font-semibold">Aberto</span>
              <span className="text-gray-600"> ⋅ Fecha 00:00</span>
            </p>
          </div>
          
          {/* Botões de Ação: tamanho reduzido de h/w-10 para h/w-8 e ícones de 18 para 14 */}
          <div className="flex flex-col gap-2">
            <button className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100">
              <FaMapMarkerAlt size={14} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100">
              <FaBookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupContent;