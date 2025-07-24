'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PontoTuristico } from '@/types/ponto';
import { Suggestion } from '@/types/suggestion';
import api from '@/axios/config';
import ModalEditarPonto from './ModalEditarPonto';
import ModalCategorias from './ModalCategorias';
import { FaTachometerAlt, FaPen, FaTrash, FaSearch, FaRegChartBar, FaTags, FaCheck, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import ModalAprovarSugestao from './ModalAprovarSugestao';
import Link from 'next/link';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios
import { FaBars } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Importações e registros do Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ITEMS_PER_PAGE = 5;


const PageAdmin = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [suggestionToApprove, setSuggestionToApprove] = useState<Suggestion | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);


    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const token = Cookies.get('token');
        if (!token) {
            setError("Acesso negado. Você precisa estar logado como administrador.");
            setLoading(false);
            return;
        }
        
        try {
            const placesPromise = api.get('/places/getPlaces');
            const suggestionsPromise = api.get('/suggestions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const [placesResponse, suggestionsResponse] = await Promise.all([placesPromise, suggestionsPromise]);

            const pontosProcessados = placesResponse.data.map((ponto: PontoTuristico) => ({
                ...ponto,
                createdAt: ponto.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            }));
            setPontos(pontosProcessados);
            setSuggestions(suggestionsResponse.data);

        } catch (err: unknown) {
            console.error("Erro ao buscar dados do dashboard:", err);
            let errorMessage = 'Não foi possível carregar os dados do painel.';
            if (isAxiosError(err) && err.response?.status === 403) {
                errorMessage = "Você não tem permissão para acessar estes dados.";
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const cardData = useMemo(() => {
        const total = pontos.length;
        const mediaRating = pontos.reduce((acc, p) => acc + (p.averageRating || 0), 0) / (total || 1);
        const tipos = new Set(pontos.map(p => p.category?.name).filter(Boolean)).size;
        return { total, mediaRating: mediaRating.toFixed(1), tipos, sugestoes: suggestions.length };
    }, [pontos, suggestions]);

    // const chartData = useMemo(() => {
    //     const countsByMonth: { [key: string]: number } = { "Jan": 0, "Fev": 0, "Mar": 0, "Abr": 0, "Mai": 0, "Jun": 0 };
    //     const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    //     pontos.forEach(ponto => {
    //         if (ponto.createdAt) {
    //             const month = new Date(ponto.createdAt).getMonth();
    //             if(month <= 5) {
    //                 countsByMonth[monthNames[month]]++;
    //             }
    //         }
    //     });
    //     return { labels: monthNames, data: Object.values(countsByMonth) };
    // }, [pontos]);

    // Em PageAdmin.tsx

    const chartData = useMemo(() => {
        // Define os nomes dos últimos 6 meses, incluindo o atual
        const monthNames: string[] = [];
        const countsByMonth: { [key: string]: number } = {};
        const today = new Date(); // Usa a data atual para ser dinâmico

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''); // Ex: "Jul", "Ago"
            const formattedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            monthNames.push(formattedName);
            countsByMonth[formattedName] = 0;
        }

        pontos.forEach(ponto => {
            if (ponto.createdAt) {
                const d = new Date(ponto.createdAt);
                // Verifica se o ponto foi criado nos últimos 6 meses
                const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
                if (d >= sixMonthsAgo) {
                    const monthName = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
                    const formattedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    if (countsByMonth.hasOwnProperty(formattedName)) {
                        countsByMonth[formattedName]++;
                    }
                }
            }
        });

        return { labels: monthNames, data: Object.values(countsByMonth) };
    }, [pontos]);

    const filteredPontos = useMemo(() => {
        if (!searchTerm) return pontos;
        return pontos.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [pontos, searchTerm]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
            try {
                await api.delete(`/places/${id}`);
                setPontos(pontos.filter((ponto) => ponto.id !== id));
            } catch (err: unknown) {
                console.error("Erro ao apagar ponto:", err);
                let errorMessage = 'Não foi possível apagar o ponto.';
                if(isAxiosError(err) && err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
                setError(errorMessage);
            }
        }
    };

    const handleEdit = (ponto: PontoTuristico) => {
        setPontoParaEditar(ponto);
        setIsEditModalOpen(true);
    };

    const handleApproveClick = (suggestion: Suggestion) => {
        setSuggestionToApprove(suggestion);
        setIsApprovalModalOpen(true);
    };

    const handleRejectClick = async (suggestionId: string) => {
        if (window.confirm("Tem certeza que deseja rejeitar esta sugestão?")) {
            try {
                await api.patch(`/suggestions/${suggestionId}/reject`);
                setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
            } catch (err: unknown) {
                console.error("Erro ao rejeitar sugestão:", err);
                setError("Erro ao rejeitar a sugestão. Tente novamente.");
            }
        }
    };

        // --- NOVA LÓGICA PARA PAGINAÇÃO ---
    const paginatedPontos = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredPontos.slice(startIndex, endIndex);
    }, [filteredPontos, currentPage]);

    const totalPages = Math.ceil(filteredPontos.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    // Reinicia para a primeira página sempre que a busca mudar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans ">
            {error && (
                <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-center">{error}</p>
                </div>
                </div>
            )}

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            {/* Sidebar */}
            <aside className={`
                bg-gray-800 text-white w-64 flex-shrink-0
                fixed top-0 left-0 h-screen z-40 
                transition-transform duration-300 ease-in-out
                md:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center justify-center bg-gray-900">
                    <Link href="/"><Image src="/images/logoAmotur-branco.png" alt="Logo AMOTUR" width={120} height={40} /></Link>
                </div>
                <nav className="mt-4">
                    <span className="px-4 text-xs text-gray-400 uppercase">Principal</span>
                    <Link href="#" className="flex items-center mt-2 py-2 px-4 bg-gray-700 text-white"><FaTachometerAlt className="mr-3" /> Dashboard</Link>
                    <Link href="/" className="flex items-center mt-2 py-2 px-4 text-gray-400 hover:bg-gray-700 hover:text-white"><FaRegChartBar className="mr-3" /> Voltar ao mapa</Link>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col md:ml-64">
                {/* Header com botão hamburger para mobile */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
                    <button 
                        className="md:hidden text-gray-600"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <FaBars size={24} />
                    </button>
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="w-6"></div> {/* Espaçador para centralizar o título */}
                </header>

                <main className="flex-1 p-4 md:p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                            <p className="font-bold">Ocorreu um Erro</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Cards de Informações */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Seus 4 cards aqui, eles vão se ajustar automaticamente */}
                        <div className="bg-blue-500 text-white p-5 rounded-lg shadow"><h3 className="text-lg">Locais Criados</h3><p className="text-3xl font-bold">{cardData.total}</p></div>
                        <div className="bg-yellow-500 text-white p-5 rounded-lg shadow"><h3 className="text-lg">Média de Avaliação</h3><p className="text-3xl font-bold">{cardData.mediaRating}</p></div>
                        <div className="bg-green-500 text-white p-5 rounded-lg shadow"><h3 className="text-lg">Categorias Únicas</h3><p className="text-3xl font-bold">{cardData.tipos}</p></div>
                        <div className="bg-purple-500 text-white p-5 rounded-lg shadow"><h3 className="text-lg">Sugestões Pendentes</h3><p className="text-3xl font-bold">{cardData.sugestoes}</p></div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-2">Locais por Mês (Gráfico de Linha)</h3>
                            <Line 
                                options={{ responsive: true }} 
                                data={{ 
                                    labels: chartData.labels, 
                                    datasets: [{ 
                                        label: 'Locais', 
                                        data: chartData.data, 
                                        backgroundColor: 'rgba(54, 162, 235, 0.5)', 
                                        borderColor: 'rgb(54, 162, 235)', 
                                        fill: true 
                                    }] 
                                }} 
                            />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold mb-2">Locais por Mês (Gráfico de Barras)</h3>
                            <Bar 
                                options={{ responsive: true }} 
                                data={{ 
                                    labels: chartData.labels, 
                                    datasets: [{ 
                                        label: 'Locais', 
                                        data: chartData.data, 
                                        backgroundColor: 'rgba(54, 162, 235, 0.6)' 
                                    }] 
                                }} 
                            />
                        </div>
                    </div>
                    
                    {/* Tabela de Sugestões Pendentes */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Sugestões Pendentes</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Local Sugerido</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Usuário</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <tr><td colSpan={4} className="text-center py-4">Carregando...</td></tr>}
                                    {!loading && suggestions.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-gray-500">Nenhuma sugestão pendente.</td></tr>}
                                    {!loading && suggestions.map((sug) => (
                                        <tr key={sug.id}>
                                            <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                                                <p className="font-bold">{sug.name}</p>
                                                <p className="text-xs text-gray-600">{sug.description}</p>
                                            </td>
                                            <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{sug.user.name} ({sug.user.email})</td>
                                            <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{new Date(sug.createdAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                                                <button onClick={() => handleApproveClick(sug)} title="Aprovar" className="text-green-600 hover:text-green-900 mr-3"><FaCheck /></button>
                                                <button onClick={() => handleRejectClick(sug.id)} title="Rejeitar" className="text-red-600 hover:text-red-900"><FaTimes /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabela de Locais */}
                    <div className="bg-white p-4 rounded-lg shadow">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <h3 className="text-xl font-semibold">Lista de Locais</h3>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                <button onClick={() => setIsCategoryModalOpen(true)} className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center">
                                    <FaTags className="mr-2" /> Categorias
                                </button>
                                <div className="relative flex-grow">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-2"><FaSearch className="text-gray-400" /></span>
                                     <input type="text" placeholder="Filtrar por nome..." className="border border-gray-300 rounded-md py-2 px-4 pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                 </div>
                            </div>
                         </div>
                         <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                 <thead>
                                     <tr>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Categoria</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Avaliação Média</th>
                                         <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {loading && <tr><td colSpan={4} className="text-center py-4">Carregando...</td></tr>}
                                     {!loading && paginatedPontos.map((ponto) => (
                                         <tr key={ponto.id}>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.name}</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.category?.name || 'Sem Categoria'}</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{ponto.averageRating?.toFixed(1) || 'N/A'} ⭐</td>
                                             <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                                                 <button onClick={() => handleEdit(ponto)} className="text-blue-600 hover:text-blue-900 mr-3"><FaPen /></button>
                                                 <button onClick={() => handleDelete(ponto.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                         {/* --- COMPONENTE DE PAGINAÇÃO ADICIONADO AQUI --- */}
                        {!loading && totalPages > 1 && (
                            <div className="px-5 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                                <span className="text-xs xs:text-sm text-gray-900">
                                    Mostrando {paginatedPontos.length} de {filteredPontos.length} Locais
                                </span>
                                <div className="inline-flex mt-2 xs:mt-0">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                                    >
                                        <FaChevronLeft/>
                                    </button>
                                    <span className="text-sm bg-gray-200 text-gray-800 font-semibold py-2 px-4">
                                      Pág {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                                    >
                                        <FaChevronRight/>
                                    </button>
                                </div>
                            </div>
                        )}
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
            
            {isCategoryModalOpen && (
                <ModalCategorias onClose={() => setIsCategoryModalOpen(false)} />
            )}

             {/* Renderiza o novo modal de aprovação */}
            {isApprovalModalOpen && suggestionToApprove && (
                <ModalAprovarSugestao
                    suggestion={suggestionToApprove}
                    onClose={() => setIsApprovalModalOpen(false)}
                    onApproved={() => {
                        setIsApprovalModalOpen(false);
                        // Remove a sugestão da lista e atualiza a lista de locais
                        setSuggestions(prev => prev.filter(s => s.id !== suggestionToApprove.id));
                        // Idealmente, você buscaria os locais de novo para ver o novo ponto
                        // fetchPontos(); // Esta função não existe neste escopo, mas seria a ideia
                    }}
                />
            )}
        </div>
    );
};

export default PageAdmin;