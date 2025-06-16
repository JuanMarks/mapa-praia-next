'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const slides = [
  { id: 1, title: 'Lojinha do Sol', image: '/images/img1.jpeg' },
  { id: 2, title: 'Café da Praia', image: '/images/img2.jpeg' },
  { id: 3, title: 'Restaurante Mar Azul', image: '/images/img3.jpeg' },
  { id: 4, title: 'Pousada do Zé', image: '/images/img4.jpeg' },
  { id: 1, title: 'Lojinha do Sol', image: '/images/img1.jpeg' },
  { id: 2, title: 'Café da Praia', image: '/images/img2.jpeg' },
  { id: 3, title: 'Restaurante Mar Azul', image: '/images/img3.jpeg' },
  { id: 4, title: 'Pousada do Zé', image: '/images/img4.jpeg' },
];

export default function CarrosselHorizontal() {
  return (
    <div className="w-full bg-white">
      <div className="w-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] px-4 py-8">
        <div className="max-w-screen-xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Melhores Avaliados 🌟</h2>
          <div className="flex flex-wrap gap-2">
            {['Pontos Turísticos', 'Praças', 'Mercados', 'Restaurantes', 'Hotéis'].map((cat) => (
              <button
                key={cat}
                className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-100 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Swiper
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
          }}
          spaceBetween={20}
          navigation
          modules={[Navigation]}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-xl"
                />
                <p className="mt-2 text-center text-sm font-medium text-gray-700">
                  {slide.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
