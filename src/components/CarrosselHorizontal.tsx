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

// Mapeamento dos nomes de exibição para os valores de filtro
// Os valores (ex: 'restaurante') devem corresponder exatamente ao 'name' da sua Categoria no banco de dados
const CATEGORIAS = {
    'Todos': 'todos',
    'Restaurantes': 'restaurante',
    'Hotéis': 'hotel',
    'Praias': 'praia',
    'Sorveterias': 'sorveteria',
    'Pizzarias': 'pizzaria',
    'Bares': 'bar',
    'Cafés': 'cafe',
    'Lanchonetes': 'lanchonete',
    'Mercados': 'mercado',
};

const CarrosselHorizontal: FC = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrar, setMostrar] = useState(true);
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

    // Lógica para filtrar e ordenar os pontos
    const pontosFiltrados = useMemo(() => {
        return pontos
            .filter(ponto => {
                // Se o filtro for 'todos', retorna todos os pontos
                if (filtroAtivo === 'todos') {
                    return true;
                }
                // CORREÇÃO: Compara o nome da categoria do ponto com o filtro ativo
                return ponto.category?.name?.toLowerCase() === filtroAtivo.toLowerCase();
            })
            .sort((a, b) => {
                // Ordena pelos melhores avaliados (maior rating primeiro)
                return (b.averageRating || 0) - (a.averageRating || 0);
            });
    }, [pontos, filtroAtivo]); // Recalcula apenas quando os pontos ou o filtro mudam

    const getImagemDoPonto = (ponto: PontoTuristico): string => {
        if (ponto.photos && ponto.photos.length > 0) {
            return ponto.photos[0];
        }
        return '/images/placeholder.jpeg'; // Use uma imagem placeholder
    };

    if (loading) {
        return <div className="text-center p-10">Carregando destaques...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Erro: {error}</div>;
    }

    return (
        <div className="w-full bg-white py-8">
            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <div className="max-w-screen-xl mx-auto px-4">
                    {/* Título e filtros */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Melhores Avaliados ⭐</h2>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(CATEGORIAS).map(([nome, tipo]) => (
                                <button
                                    key={tipo}
                                    onClick={() => setFiltroAtivo(tipo)}
                                    className={`px-4 py-1.5 border rounded-full text-sm font-semibold transition-all duration-200 ${
                                        filtroAtivo === tipo
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
                        {pontosFiltrados.map((ponto) => (
                            <SwiperSlide key={ponto.id}>
                                <div className="bg-white rounded-2xl transition p-2 h-full">
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
                </div>
            </motion.div>
        </div>
    );
};

export default CarrosselHorizontal;