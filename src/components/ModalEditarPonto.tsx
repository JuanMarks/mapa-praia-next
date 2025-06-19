import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PontoTuristico } from '@/types/ponto';

const ICONS = ['🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐'];

interface Props {
  ponto: PontoTuristico;
  onClose: () => void;
  onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

const ModalEditarPonto = ({ ponto, onClose, onAtualizado }: Props) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [iconeUrl, setIconeUrl] = useState('');
  const [imagens, setImagens] = useState<File[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preenche o formulário quando o componente é montado com os dados do ponto
  useEffect(() => {
    if (ponto) {
      setNome(ponto.nome);
      setDescricao(ponto.descricao);
      setIconeUrl(ponto.iconeUrl || '');
    }
  }, [ponto]);

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagens(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Atualiza os dados de texto do ponto
      const res = await fetch(`http://25.20.79.62:3003/pontos/${ponto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, iconeUrl }),
      });

      if (!res.ok) {
        throw new Error('Falha ao atualizar o ponto.');
      }
      let pontoAtualizado = await res.json();

      // 2. Se novas imagens foram selecionadas, envia para o backend
      if (imagens.length > 0) {
        const formData = new FormData();
        imagens.forEach((imagem) => formData.append('fotos', imagem));
        
        const resFotos = await fetch(`http://25.20.79.62:3003/pontos/${ponto.id}/fotos`, {
            method: 'POST',
            body: formData,
        });

        if(!resFotos.ok) {
            throw new Error('Dados atualizados, mas falha ao enviar novas fotos.');
        }
        // Opcional: backend pode retornar o ponto com as novas fotos
        pontoAtualizado = await resFotos.json();
      }

      // Notifica o componente pai que o ponto foi atualizado
      onAtualizado(pontoAtualizado);
      onClose(); // Fecha o modal

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!ponto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[5000] flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Editar Ponto Turístico</h3>
          <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 p-1.5 rounded-lg">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
            
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
              <textarea id="descricao" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading}></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
              <div className="flex flex-wrap gap-3">
                {ICONS.map((icon) => (
                  <label className="cursor-pointer" key={icon}>
                    <input type="radio" name="icon" value={icon} className="sr-only peer" checked={iconeUrl === icon} onChange={() => setIconeUrl(icon)} />
                    <div className="text-3xl p-1 rounded-md transition-all hover:bg-gray-200 peer-checked:bg-indigo-200 ring-indigo-500 peer-checked:ring-2">{icon}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                    Adicionar Novas Imagens (Opcional)
                </label>
                <p className="text-xs text-gray-500 mb-2">As imagens existentes serão mantidas. Novas imagens selecionadas serão adicionadas ao ponto.</p>
                <input id="imagem" type="file" accept="image/*" multiple onChange={handleImagemChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" disabled={isLoading}/>
            </div>
          </div>
          <div className="flex items-center justify-end p-4 space-x-2 border-t">
            <button type="button" onClick={onClose} disabled={isLoading} className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg px-5 py-2.5">Cancelar</button>
            <button type="submit" disabled={isLoading} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPonto;