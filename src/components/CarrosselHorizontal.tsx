'use client';

import { useState, useEffect, FC, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { PontoTuristico } from '@/types/ponto';
import { motion } from 'framer-motion';
import api from '@/axios/config';

// 1. Mapeamento dos tipos para os botões.
// Use os valores exatos do seu backend (ex: 'restaurante', 'hotel').
const CATEGORIAS = {
    'Todos': 'todos',
    'Restaurantes': 'restaurante',
    'Hotéis': 'hotel',
    'Praias': 'praia',
    'Sorveterias': 'sorveteria'
    // Adicione outras categorias que você tenha
};

const CarrosselHorizontal: FC = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrar, setMostrar] = useState(true);
    
    // 2. Novo estado para controlar o filtro ativo
    const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');

    useEffect(() => {
        const fetchPontos = async () => {
            try {
                setLoading(true);
                const response = await api.get('/places/getPlaces');
                setPontos(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPontos();
    }, []);

    // 3. Lógica para filtrar e ordenar os pontos
    const pontosFiltrados = useMemo(() => {
        return pontos
            .filter(ponto => {
                // Se o filtro for 'todos', retorna todos os pontos
                if (filtroAtivo === 'todos') {
                    return true;
                }
                // Compara o tipo do ponto com o filtro ativo
                return ponto.type?.toLowerCase() === filtroAtivo.toLowerCase();
            })
            .sort((a, b) => {
                // Ordena pelos melhores avaliados (maior rating primeiro)
                return (b.rating || 0) - (a.rating || 0);
            });
    }, [pontos, filtroAtivo]); // Recalcula apenas quando os pontos ou o filtro mudam

    const getImagemDoPonto = (ponto: PontoTuristico): string => {
        if (ponto.photos && ponto.photos.length > 0) {
            // Pega a primeira imagem para consistência visual
            return ponto.photos[0];
        }
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
            <div className="w-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] px-2 py-4">
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
                                {mostrar ? '⬇️ Fechar' : '⬆️ Abrir'}
                            </button>
                        </div>

                        {mostrar && (
                            <>
                                {/* Título e filtros */}
                                <div className="max-w-screen-xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Melhores Avaliados ⭐</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {/* 4. Botões de filtro agora são funcionais */}
                                        {Object.entries(CATEGORIAS).map(([nome, tipo]) => (
                                            <button
                                                key={tipo}
                                                onClick={() => setFiltroAtivo(tipo)}
                                                className={`px-4 py-1.5 border rounded-full text-sm font-semibold transition-all duration-200 ${
                                                    filtroAtivo === tipo
                                                        ? 'bg-blue-600 text-white border-blue-600' // Estilo ativo
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' // Estilo padrão
                                                }`}
                                            >
                                                {nome}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Carrossel */}
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
                                    {/* 5. Mapeia sobre os pontos JÁ filtrados e ordenados */}
                                    {pontosFiltrados.map((ponto) => (
                                        <SwiperSlide key={ponto.id}>
                                            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2 h-full">
                                                <div className="w-full h-40 sm:h-48 relative">
                                                    <Image
                                                        src={getImagemDoPonto(ponto)}
                                                        alt={ponto.name}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        className="rounded-xl"
                                                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 28vw"
                                                    />
                                                </div>
                                                <p className="mt-2 text-center text-sm font-bold text-gray-700">
                                                    {ponto.name}
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CarrosselHorizontal;