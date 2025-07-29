// src/components/RightSideBar.tsx (anteriormente LocationSearch.tsx)
'use client';

import { useState, useEffect, useRef } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { useAuth } from '@/hooks/useAuth';
import api from '@/axios/config';
import { FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import ModalEditarPonto from './ModalEditarPonto';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios

interface LocationSearchProps {
  onLocationSelect: (ponto: PontoTuristico) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [filteredPontos, setFilteredPontos] = useState<PontoTuristico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);
  const { role } = useAuth();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Função para buscar os pontos, agora com tratamento de erro
  const fetchPontos = async () => {
    try {
      const response = await api.get('/places/getPlaces');
      setPontos(response.data);
    } catch (err: unknown) {
      console.error("Erro ao buscar pontos para a pesquisa:", err);
      // Silenciosamente falha para não quebrar a UI principal, mas você poderia mostrar um erro se quisesse.
    }
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = pontos.filter(ponto =>
        ponto.name.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredPontos(filtered);
      setIsDropdownOpen(filtered.length > 0);
    } else {
      setFilteredPontos([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, pontos]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSelectLocation = (ponto: PontoTuristico) => {
    onLocationSelect(ponto);
    setSearchTerm('');
    setIsDropdownOpen(false);
    setIsSearchExpanded(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
      try {
        await api.delete(`/places/${id}`);
        // Atualiza a lista removendo o ponto deletado
        const updatedPontos = pontos.filter((p) => p.id !== id);
        setPontos(updatedPontos);
      } catch (err: unknown) { // CORRIGIDO
        console.error("Erro ao apagar ponto:", err);
        let errorMessage = 'Não foi possível apagar o ponto.';
        if(isAxiosError(err) && err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        // Em vez de alert(), você poderia usar um estado de erro para mostrar na UI, se quisesse.
        alert(errorMessage);
      } finally {
        setIsDropdownOpen(false);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, ponto: PontoTuristico) => {
    e.stopPropagation();
    setPontoParaEditar(ponto);
    setIsDropdownOpen(false);
  };
  
  const handlePontoAtualizado = (pontoAtualizado: PontoTuristico) => {
      setPontos(pontos.map(p => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
      setPontoParaEditar(null);
  };

  return (
    <>
      <div
        ref={searchContainerRef}
        className="relative flex justify-end sm:justify-start w-full"
      >
        <button 
  onClick={() => setIsSearchExpanded(true)}
  className={`
    sm:hidden bg-white rounded-full h-12 w-12
    flex items-center justify-center shadow-lg
    transition-opacity duration-300
    ${isSearchExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
    absolute left-0 top-0 z-10
  `}
  aria-label="Abrir busca"
>
  <FaSearch className="text-gray-600" />
</button>

        <div className={`
  absolute sm:relative
  w-[90%] max-w-[380px]
  right-4 sm:right-auto
  transition-all duration-300
  ${isSearchExpanded ? 'opacity-100' : 'opacity-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto'}
`}>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-2 pl-1 sm:pl-3 flex items-center ">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar locais..."
                    className="bg-white rounded-full w-70 p-3 pl-10 text-base focus:outline-none focus:border-none focus:ring-0 shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => { if(searchTerm) setIsDropdownOpen(true) }}
                />
                <button 
                  onClick={() => setIsSearchExpanded(false)}
                  className="sm:hidden absolute inset-y-0 left-60 flex items-center pr-3 text-gray-500"
                  aria-label="Fechar busca"
                >
                  <FaTimes />
                </button>
            </div>

            {isDropdownOpen && (
                <ul className="absolute mt-2 w-full bg-white rounded-xl shadow-lg overflow-y-auto max-h-60 z-50">
                    {filteredPontos.length > 0 ? filteredPontos.map(ponto => (
                        <li key={ponto.id} onClick={() => handleSelectLocation(ponto)} className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="text-gray-400 mr-3" />
                                <div>
                                    <h3 className="font-semibold">{ponto.name}</h3>
                                    <p className="text-sm text-gray-500">{ponto.description?.substring(0, 30)}...</p>
                                </div>
                            </div>
                            {role === 'admin' && (
                                <div className="flex items-center space-x-3">
                                    <button onClick={(e) => handleEdit(e, ponto)} aria-label="Editar" className="text-blue-500 hover:text-blue-700 p-1"><FaEdit /></button>
                                    <button onClick={(e) => handleDelete(e, ponto.id)} aria-label="Apagar" className="text-red-500 hover:text-red-700 p-1"><FaTrash /></button>
                                </div>
                            )}
                        </li>
                    )) : (
                        <li className="p-3 text-center text-gray-500">Nenhum local encontrado.</li>
                    )}
                </ul>
            )}
        </div>
      </div>

      {pontoParaEditar && (
        <ModalEditarPonto
          ponto={pontoParaEditar}
          onClose={() => setPontoParaEditar(null)}
          onAtualizado={handlePontoAtualizado}
        />
      )}
    </>
  );
};

export default LocationSearch;