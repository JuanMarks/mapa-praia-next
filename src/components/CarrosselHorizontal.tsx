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
import { isAxiosError } from 'axios'; // Importa o type guard do Axios

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
    const [filtroAtivo, setFiltroAtivo] = useState<string>('todos');

    useEffect(() => {
        const fetchPontos = async () => {
            try {
                setLoading(true);
                const response = await api.get('/places/getPlaces');
                setPontos(response.data);
            } catch (err: unknown) { // 1. Mude 'any' para 'unknown'
                console.error("Erro ao buscar pontos para o carrossel:", err);

                // 2. Lógica de tratamento de erro aprimorada
                let errorMessage = 'Não foi possível carregar os destaques. Verifique sua conexão.';

                if (isAxiosError(err)) {
                    if (err.response) {
                        // Se o servidor respondeu com um erro (ex: 404, 500)
                        errorMessage = 'Ocorreu um erro no servidor ao buscar os locais.';
                    }
                    // Se não houver 'err.response', a mensagem padrão de erro de rede será usada.
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchPontos();
    }, []);

    // Lógica para filtrar e ordenar os pontos (continua a mesma)
    const pontosFiltrados = useMemo(() => {
        return pontos
            .filter(ponto => {
                if (filtroAtivo === 'todos') {
                    return true;
                }
                return ponto.category?.name?.toLowerCase() === filtroAtivo.toLowerCase();
            })
            .sort((a, b) => {
                return (b.averageRating || 0) - (a.averageRating || 0);
            });
    }, [pontos, filtroAtivo]);

    const getImagemDoPonto = (ponto: PontoTuristico): string => {
        if (ponto.photos && ponto.photos.length > 0) {
            return ponto.photos[0];
        }
        return '/images/placeholder.jpeg';
    };

    if (loading) {
        return <div className="text-center p-10 text-gray-500">Carregando destaques...</div>;
    }

    // 3. Componente para exibir a mensagem de erro de forma mais elegante
    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-lg mx-4">
                <p className="font-semibold text-red-600">Ops! Algo deu errado.</p>
                <p className="text-red-500 mt-1">{error}</p>
            </div>
        );
    }
    
    // Se não houver pontos para exibir após a filtragem, mostre uma mensagem amigável
    if (pontosFiltrados.length === 0 && !loading) {
        return (
             <div className="w-full bg-white py-8">
                <div className="max-w-screen-xl mx-auto px-4">
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
                    <div className="text-center p-10 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-600">Nenhum local encontrado</p>
                        <p className="text-gray-500 mt-1">Não há locais com essa categoria no momento.</p>
                    </div>
                </div>
             </div>
        )
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