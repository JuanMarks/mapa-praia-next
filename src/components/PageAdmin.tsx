'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PontoTuristico } from '@/types/ponto';
import Header from './Header';
import ModalEditarPonto from './ModalEditarPonto';
import api from '@/axios/config';

const PageAdmin = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);

    const fetchPontos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/places/getPlaces');
            console.log(response.data);
            setPontos(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPontos();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
            try {
                const res = await api.delete(`/places/${id}`);

                if (res.status !== 200) {
                    throw new Error('Erro ao apagar o ponto');
                }

                // Remove o ponto da lista no estado local para atualizar a UI
                setPontos(pontos.filter((ponto) => ponto.id !== id));
                alert('Ponto apagado com sucesso!');
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    // 3. Função para abrir o modal com o ponto correto
    const handleEdit = (ponto: PontoTuristico) => {
        setPontoParaEditar(ponto);
        setIsEditModalOpen(true);
    };

    // 4. Função para fechar o modal
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setPontoParaEditar(null);
    };

    const handlePontoAtualizado = (pontoAtualizado: PontoTuristico) => {
        setPontos(pontos.map(p => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
        handleCloseModal();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
                    <Link href="/" passHref>
                        <span className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
                            Voltar ao Mapa
                        </span>
                    </Link>
                </div>

                {loading && <p>Carregando pontos turísticos...</p>}
                {error && <p className="text-red-500">Erro: {error}</p>}

                {!loading && !error && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Descrição
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pontos.map((ponto) => (
                                    <tr key={ponto.id}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{ponto.name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap max-w-md truncate">{ponto.description}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                onClick={() => handleEdit(ponto)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold border border-indigo-600 hover:border-indigo-900 px-3 py-1 rounded"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ponto.id)}
                                                className="text-red-600 hover:text-red-900 font-semibold border border-red-600 hover:border-red-900 px-3 py-1 rounded"
                                            >
                                                Apagar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            {/* 6. Renderizar o modal condicionalmente */}
            {isEditModalOpen && pontoParaEditar && (
                <ModalEditarPonto
                    ponto={pontoParaEditar}
                    onClose={handleCloseModal}
                    onAtualizado={handlePontoAtualizado}
                />
            )}
        </div>
    );
};

export default PageAdmin;