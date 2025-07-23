// src/components/ModalCategorias.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import api from '@/axios/config';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios
import Cookies from 'js-cookie';

interface Category {
  id: string;
  name: string;
}

interface ModalCategoriasProps {
  onClose: () => void;
}

const ModalCategorias: React.FC<ModalCategoriasProps> = ({ onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    // Não precisa de try/catch aqui se o erro for gerenciado no useEffect
    const response = await api.get('/categories');
    setCategories(response.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .catch(err => {
        console.error("Erro ao carregar categorias:", err);
        setError('Falha ao carregar as categorias. Tente novamente.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
        setError("O nome da categoria não pode estar vazio.");
        return;
    }
    setError(null);
    const token = Cookies.get('token');
    try {
      await api.post('/categories', { name: newCategoryName }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setError(null);
      setNewCategoryName('');
      fetchCategories(); // Re-fetch para atualizar a lista
    } catch (err: unknown) { // CORRIGIDO
      console.error("Erro detalhado ao adicionar categoria:", err);
      let errorMessage = 'Não foi possível adicionar a categoria.';
      if (isAxiosError(err) && err.response) {
          // Captura erros de validação ou conflito (ex: nome já existe)
          const serverMessage = err.response.data?.message;
          errorMessage = Array.isArray(serverMessage) ? serverMessage.join('. ') : serverMessage;
      }
      setError(errorMessage);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta categoria? Esta ação não pode ser desfeita.')) {
        setError(null);
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories(); // Re-fetch para atualizar a lista
        } catch (err: unknown) { // CORRIGIDO
            console.error("Erro detalhado ao apagar categoria:", err);
            let errorMessage = 'Não foi possível apagar a categoria.';
             if (isAxiosError(err) && err.response) {
                // Erro comum é tentar deletar uma categoria que ainda está em uso
                errorMessage = err.response.data?.message || 'Esta categoria não pode ser removida.';
             }
            setError(errorMessage);
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {/* Exibição de Erro Centralizada */}
        {error && <div className="text-red-700 bg-red-100 p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria"
            className="flex-grow border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center">
            <FaPlus className="mr-2" /> Adicionar
          </button>
        </form>

        <div className="max-h-64 overflow-y-auto border-t pt-4">
          {loading && <p className="text-center text-gray-500">Carregando categorias...</p>}
          
          {!loading && categories.length > 0 && (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full" aria-label={`Apagar categoria ${category.name}`}>
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && categories.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhuma categoria encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCategorias;