// ModalCategorias.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/axios/config';
import { FaTrash, FaPlus } from 'react-icons/fa';

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
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post('/categories', { name: newCategoryName });
      setNewCategoryName('');
      fetchCategories(); // Re-fetch para atualizar a lista
    } catch (err: any) {
      alert('Erro ao adicionar categoria: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta categoria?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories(); // Re-fetch para atualizar a lista
      } catch (err: any) {
        alert('Erro ao apagar categoria: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {/* Formulário para adicionar nova categoria */}
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nova categoria"
            className="flex-grow border border-gray-300 rounded-md py-2 px-3"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
            <FaPlus className="mr-2" /> Adicionar
          </button>
        </form>

        {/* Lista de categorias existentes */}
        <div className="max-h-64 overflow-y-auto">
          {loading && <p>Carregando categorias...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && categories.length > 0 && (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center p-2 border-b">
                  <span>{category.name}</span>
                  <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && categories.length === 0 && <p>Nenhuma categoria encontrada.</p>}
        </div>
      </div>
    </div>
  );
};

export default ModalCategorias;