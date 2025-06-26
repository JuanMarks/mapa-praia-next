'use client';

import { useState, useEffect, FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { PontoTuristico } from '@/types/ponto';
import { motion } from 'framer-motion';



const API_BASE_URL = 'http://25.20.79.62:3003';

const CarrosselHorizontal: FC = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrar, setMostrar] = useState(true);

    useEffect(() => {
        const fetchPontos = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/pontos`);
                if (!res.ok) throw new Error('Falha ao buscar os pontos.');
                const data: PontoTuristico[] = await res.json();
                setPontos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPontos();
    }, []);

    const getImagemDoPonto = (ponto: PontoTuristico): string => {
        if (ponto.fotosOficiais && ponto.fotosOficiais.length > 0) {
            const randomIndex = Math.floor(Math.random() * ponto.fotosOficiais.length);
            const caminhoDaFoto = ponto.fotosOficiais[randomIndex];
            return `${API_BASE_URL}${caminhoDaFoto}`;
        }
        // Usando uma de suas imagens estáticas como placeholder
        return '/images/img1.jpeg';
    };

    if (loading) {
        return <div className="text-center p-10">Carregando destaques...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Erro: {error}</div>;
    }





    return (
        <div className="w-full bg-white">
            <div className="w-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] px-4 py-8">
                <motion.div
                    className="w-full bg-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="w-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] px-4 py-6 rounded-xl">

                        {/* Botão mobile */}
                        <div className="flex justify-end sm:hidden mb-2">
                            <button
                                onClick={() => setMostrar(!mostrar)}
                                className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded-full"
                            >
                                {mostrar ? '⬇️ Esconder' : '⬆️ Mostrar'}
                            </button>
                        </div>

                        {mostrar && (
                            <div className="max-w-screen-xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-900">Melhores Avaliados 🌟</h2>
                                <div className="flex flex-wrap gap-2">
                                    {['Pontos Turísticos', 'Praças', 'Mercados', 'Restaurantes', 'Hotéis'].map((cat) => (
                                        <button
                                            key={cat}
                                            className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-orange-100 transition-all"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>


                        )
                        }
                    </div>
                </motion.div>
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
                    {/* Alteração: Mapeando os 'pontos' da API em vez dos 'slides' estáticos */}
                    {pontos.map((ponto) => (
                        <SwiperSlide key={ponto.id}>
                            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2 h-full">
                                <div className="w-full h-40 sm:h-48 relative">
                                    <Image
                                        src={getImagemDoPonto(ponto)}
                                        alt={ponto.nome}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-xl"
                                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 28vw"
                                    />
                                </div>
                                <p className="mt-2 text-center text-sm font-medium text-gray-700">
                                    {ponto.nome}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default CarrosselHorizontal;

