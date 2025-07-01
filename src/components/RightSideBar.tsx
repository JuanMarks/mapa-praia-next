// src/components/RightSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { useAuth } from '@/hooks/useAuth';
import api from '@/axios/config';
import { FaEdit, FaTrash, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import ModalEditarPonto from './ModalEditarPonto';

interface RightSidebarProps {
  onLocationSelect: (ponto: PontoTuristico) => void;
}

const RightSidebar = ({ onLocationSelect }: RightSidebarProps) => {
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [filteredPontos, setFilteredPontos] = useState<PontoTuristico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pontoParaEditar, setPontoParaEditar] = useState<PontoTuristico | null>(null);
  const { role } = useAuth();

  const fetchPontos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/places/getPlaces');
      setPontos(response.data);
      setFilteredPontos(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = pontos.filter(ponto =>
      ponto.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredPontos(filtered);
  }, [searchTerm, pontos]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este ponto?')) {
      try {
        await api.delete(`/places/${id}`);
        setPontos(pontos.filter((ponto) => ponto.id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (ponto: PontoTuristico) => {
    setPontoParaEditar(ponto);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setPontoParaEditar(null);
  };

  const handlePontoAtualizado = (pontoAtualizado: PontoTuristico) => {
    setPontos(pontos.map(p => (p.id === pontoAtualizado.id ? pontoAtualizado : p)));
    handleCloseModal();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-l-full shadow-lg z-40"
        aria-label="Mostrar sidebar"
      >
        <FaChevronLeft size={20} />
      </button>
    );
  }

  return (
    <>
      <div className="absolute top-0 right-0 h-150 bg-white shadow-lg z-[5005] w-80 p-4 transition-transform duration-300 ease-in-out rounded m-10">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white p-2 rounded-l-full shadow-lg"
          aria-label="Esconder sidebar"
        >
          <FaChevronRight size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Locais</h2>
        <input
          type="text"
          placeholder="Filtrar locais..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="overflow-y-auto h-[calc(100%-100px)]">
          {filteredPontos.map(ponto => (
            <li onClick={() => onLocationSelect(ponto)} key={ponto.id} className="mb-2 p-2 border-b">
              <h3 className="font-semibold">{ponto.name}</h3>
              <p className="text-sm text-gray-600">{ponto.description}</p>
              {role === 'admin' && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleEdit(ponto)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(ponto.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isEditModalOpen && pontoParaEditar && (
        <ModalEditarPonto
          ponto={pontoParaEditar}
          onClose={handleCloseModal}
          onAtualizado={handlePontoAtualizado}
        />
      )}
    </>
  );
};

export default RightSidebar;