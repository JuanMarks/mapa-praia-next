// src/components/LocationSearch.tsx
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
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
      try {
        await api.delete(`/places/${id}`);
        setPontos(pontos.filter((p) => String(p.id) !== String(id)));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, ponto: PontoTuristico) => {
    e.stopPropagation();
    setPontoParaEditar(ponto);
  };

  return (
    <>
      <div
        ref={searchContainerRef}
        className="w-full " // Permanece w-full para se ajustar ao pai
      >
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </div>

          <input
            type="text"
            placeholder="Pesquisar locais..."
            className="bg-white rounded-full w-full p-3 pl-10 text-base focus:outline-none focus:border-none focus:ring-0 shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if(searchTerm) setIsDropdownOpen(true) }}
          />
        </div>

        {isDropdownOpen && filteredPontos.length > 0 && (
          <ul className="absolute mt-2 pr-10 bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-down z-50">
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
                      onClick={(e) => handleDelete(e, Number(ponto.id))}
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