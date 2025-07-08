'use client';

import { useState, useEffect, useRef } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { useAuth } from '@/hooks/useAuth';
import api from '@/axios/config';
import { FaEdit, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import ModalEditarPonto from './ModalEditarPonto';

interface LocationSearchProps {
  onLocationSelect: (ponto: PontoTuristico) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [filteredPontos, setFilteredPontos] = useState<PontoTuristico[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);
    const { role } = useAuth();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Busca os pontos turísticos da API
    useEffect(() => {
        const fetchPontos = async () => {
            try {
                const response = await api.get('/places/getPlaces');
                setPontos(response.data);
            } catch (err) {
                console.error("Erro ao buscar pontos:", err);
            }
        };
        fetchPontos();
    }, []);

    // Filtra os pontos com base no termo de busca
    useEffect(() => {
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = pontos.filter(ponto =>
                ponto.name.toLowerCase().includes(lowercasedFilter)
            );
            setFilteredPontos(filtered);
            setIsDropdownOpen(true);
        } else {
            setFilteredPontos([]);
            setIsDropdownOpen(false);
        }
    }, [searchTerm, pontos]);

    // Hook para fechar o dropdown ao clicar fora do componente
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]);

    const handleSelectLocation = (ponto: PontoTuristico) => {
        onLocationSelect(ponto);
        setSearchTerm(''); // Limpa a busca após a seleção
        setIsDropdownOpen(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Impede que o dropdown feche
        if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
            try {
                await api.delete(`/places/${id}`);
                setPontos(pontos.filter((p) => p.id !== id));
            } catch (err: any) {
                alert(err.message);
            }
        }
    };
    
    const handleEdit = (e: React.MouseEvent, ponto: PontoTuristico) => {
        e.stopPropagation(); // Impede que o dropdown feche
        setPontoParaEditar(ponto);
    };

    return (
        <>
            <div 
                ref={searchContainerRef}
                // Posiciona o componente no canto superior direito sobre o mapa
                className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 md:right-12 lg:right-16 z-[5000] w-[90%] sm:w-[80%] md:w-[400px]"
            >
                <div className="relative shadow-lg overflow-hidden">
                    {/* Ícone de busca dentro do input */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-400" />
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Pesquisar locais..."
                        className="w-full p-3 pl-10 text-base focus:outline-none focus:border-none focus:ring-0 rounded shadow-lg   "
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => { if(searchTerm) setIsDropdownOpen(true) }}
                    />
                </div>

                {/* Dropdown com a lista de resultados */}
                {isDropdownOpen && filteredPontos.length > 0 && (
                    <ul className="absolute mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-down">
                        {filteredPontos.map(ponto => (
                            <li 
                                key={ponto.id} 
                                onClick={() => handleSelectLocation(ponto)}
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                                    <div>
                                        <h3 className="font-semibold">{ponto.name}</h3>
                                        <p className="text-sm text-gray-500">{ponto.description.substring(0, 30)}...</p>
                                    </div>
                                </div>
                                
                                {role === 'admin' && (
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={(e) => handleEdit(e, ponto)}
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            aria-label="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, ponto.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            aria-label="Apagar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {pontoParaEditar && (
                <ModalEditarPonto
                    ponto={pontoParaEditar}
                    onClose={() => setPontoParaEditar(null)}
                    onAtualizado={(pontoAtualizado) => {
                        setPontos(pontos.map(p => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
                        setPontoParaEditar(null);
                    }}
                />
            )}
        </>
    );
};

export default LocationSearch;