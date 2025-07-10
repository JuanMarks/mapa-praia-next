'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PontoTuristico } from '@/types/ponto';
import api from '@/axios/config';
import ModalEditarPonto from './ModalEditarPonto';
import ModalCategorias from './ModalCategorias'; // Importe o novo modal
import { FaTachometerAlt, FaTable, FaPen, FaTrash, FaSearch, FaRegChartBar, FaTags } from 'react-icons/fa';

// Importações e registros do Chart.js (sem alteração)
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PageAdmin = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado para o modal de edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);

    // Estado para o novo modal de categorias
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Busca inicial de dados (sem alteração)
    useEffect(() => {
        const fetchPontos = async () => {
            try {
                setLoading(true);
                const response = await api.get('/places/getPlaces');
                const pontosProcessados = response.data.map((ponto: any) => {
                    const pontoNormalizado = { ...ponto };
                    pontoNormalizado.createdAt = ponto.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
                    if (pontoNormalizado.address && 'update' in pontoNormalizado.address) {
                        pontoNormalizado.address = pontoNormalizado.address.update;
                    }
                    return pontoNormalizado;
                });
                setPontos(pontosProcessados);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPontos();
    }, []);

    // Memoização dos cards e dados do gráfico (sem alteração)
    const cardData = useMemo(() => {
        if (pontos.length === 0) return { total: 0, mediaRating: 0, tipos: 0 };
        const total = pontos.length;
        const mediaRating = pontos.reduce((acc, p) => acc + (p.rating || 0), 0) / total;
        const tipos = new Set(pontos.map(p => p.type)).size;
        return { total, mediaRating: mediaRating.toFixed(1), tipos };
    }, [pontos]);

    const chartData = useMemo(() => {
        const countsByMonth: { [key: string]: number } = { "Jan": 0, "Fev": 0, "Mar": 0, "Abr": 0, "Mai": 0, "Jun": 0 };
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
        pontos.forEach(ponto => {
            if (ponto.createdAt) {
                const month = new Date(ponto.createdAt).getMonth();
                if(month <= 5) {
                    countsByMonth[monthNames[month]]++;
                }
            }
        });
        return { labels: monthNames, data: Object.values(countsByMonth) };
    }, [pontos]);

    // Filtro dos locais (sem alteração)
    const filteredPontos = useMemo(() => {
        if (!searchTerm) return pontos;
        return pontos.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [pontos, searchTerm]);

    // Handlers de delete e edição (sem alteração)
    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
            try {
                await api.delete(`/places/${id}`);
                setPontos(pontos.filter((ponto) => ponto.id !== id));
                alert('Ponto apagado com sucesso!');
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleEdit = (ponto: PontoTuristico) => {
        setPontoParaEditar(ponto);
        setIsEditModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans ">
            <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
                <div className="h-16 flex items-center justify-center bg-gray-900">
                    <a href="/">
                        <Image src="/images/logoAmotur-branco.png" alt="Logo AMOTUR" width={120} height={40} />
                    </a>
                </div>
                <nav className="mt-4">
                    <span className="px-4 text-xs text-gray-400 uppercase">Principal</span>
                    <a href="#" className="flex items-center mt-2 py-2 px-4 bg-gray-700 text-white">
                        <FaTachometerAlt className="mr-3" /> Dashboard
                    </a>
                     <a href="/" className="flex items-center mt-2 py-2 px-4 text-gray-400 hover:bg-gray-700 hover:text-white">
                         <FaRegChartBar className="mr-3" /> Voltar ao mapa
                     </a>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    {/* Cards de Informações (sem alteração) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                         <div className="bg-blue-500 text-white p-5 rounded-lg shadow">
                             <h3 className="text-lg">Locais Criados</h3>
                             <p className="text-3xl font-bold">{cardData.total}</p>
                         </div>
                         <div className="bg-yellow-500 text-white p-5 rounded-lg shadow">
                             <h3 className="text-lg">Média de Avaliação</h3>
                             <p className="text-3xl font-bold">{cardData.mediaRating}</p>
                         </div>
                         <div className="bg-green-500 text-white p-5 rounded-lg shadow">
                             <h3 className="text-lg">Categorias Únicas</h3>
                             <p className="text-3xl font-bold">{cardData.tipos}</p>
                         </div>
                         <div className="bg-red-500 text-white p-5 rounded-lg shadow">
                              <h3 className="text-lg">Novos Cadastros</h3>
                             <p className="text-3xl font-bold">0</p>
                         </div>
                    </div>

                    {/* Gráficos (sem alteração) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         <div className="bg-white p-4 rounded-lg shadow">
                             <h3 className="font-semibold mb-2">Locais por Mês (Gráfico de Linha)</h3>
                             <Line options={{ responsive: true }} data={{ labels: chartData.labels, datasets: [{ label: 'Locais', data: chartData.data, backgroundColor: 'rgba(54, 162, 235, 0.5)', borderColor: 'rgb(54, 162, 235)', fill: true }] }} />
                         </div>
                         <div className="bg-white p-4 rounded-lg shadow">
                             <h3 className="font-semibold mb-2">Locais por Mês (Gráfico de Barras)</h3>
                             <Bar options={{ responsive: true }} data={{ labels: chartData.labels, datasets: [{ label: 'Locais', data: chartData.data, backgroundColor: 'rgba(54, 162, 235, 0.6)' }] }} />
                         </div>
                    </div>
                    
                    {/* Tabela de Locais */}
                    <div className="bg-white p-4 rounded-lg shadow">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Lista de Locais</h3>
                            <div className="flex items-center gap-4"> {/* Container para filtros e botão */}
                                
                                {/* Botão para abrir o modal de categorias */}
                                <button
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
                                >
                                    <FaTags className="mr-2" /> Categorias
                                </button>
                                
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                         <FaSearch className="text-gray-400" />
                                     </span>
                                     <input
                                         type="text"
                                         placeholder="Filtrar por nome..."
                                         className="border border-gray-300 rounded-md py-2 px-4 pl-8"
                                         value={searchTerm}
                                         onChange={(e) => setSearchTerm(e.target.value)}
                                     />
                                 </div>
                            </div>
                         </div>
                         <div className="overflow-x-auto">
                             <table className="min-w-full leading-normal">
                                 <thead>
                                     <tr>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Avaliação</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {loading && <tr><td colSpan={4} className="text-center py-4">Carregando...</td></tr>}
                                     {!loading && filteredPontos.map((ponto) => (
                                         <tr key={ponto.id}>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.name}</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.type}</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.rating || 'N/A'} ⭐</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                                                 <button onClick={() => handleEdit(ponto)} className="text-blue-600 hover:text-blue-900 mr-3"><FaPen /></button>
                                                 <button onClick={() => handleDelete(ponto.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                </main>
            </div>

            {isEditModalOpen && pontoParaEditar && (
                <ModalEditarPonto
                    ponto={pontoParaEditar}
                    onClose={() => setIsEditModalOpen(false)}
                    onAtualizado={(pontoAtualizado) => {
                        setPontos(pontos.map(p => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
                        setIsEditModalOpen(false);
                    }}
                />
            )}
            
            {/* Renderiza o modal de categorias quando estiver aberto */}
            {isCategoryModalOpen && (
                <ModalCategorias onClose={() => setIsCategoryModalOpen(false)} />
            )}
        </div>
    );
};

export default PageAdmin;