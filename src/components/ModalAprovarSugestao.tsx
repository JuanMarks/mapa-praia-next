// components/ModalAprovarSugestao.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import api from '@/axios/config';
import { Suggestion } from '@/types/suggestion';

interface Category {
  id: string;
  name: string;
}

interface Props {
  suggestion: Suggestion;
  onClose: () => void;
  onApproved: () => void;
}

const ModalAprovarSugestao = ({ suggestion, onClose, onApproved }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [iconURL, setIconURL] = useState('https://cdn-icons-png.flaticon.com/512/854/854878.png');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Por favor, selecione uma categoria.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await api.post(`/suggestions/${suggestion.id}/approve`, {
        categoryId,
        iconURL,
      });
      alert('Sugestão aprovada e novo local criado!');
      onApproved();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao aprovar sugestão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Aprovar Sugestão</h2>
        <p className="mb-1"><strong>Nome:</strong> {suggestion.name}</p>
        <p className="mb-4"><strong>Descrição:</strong> {suggestion.description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>}
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria *</label>
            <select
              id="category"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Selecione...</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="iconURL" className="block text-sm font-medium text-gray-700">URL do Ícone *</label>
            <input
              type="text"
              id="iconURL"
              value={iconURL}
              onChange={e => setIconURL(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Aprovando...' : 'Aprovar e Criar Local'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAprovarSugestao;