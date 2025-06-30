import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PontoTuristico } from '@/types/ponto'; // Certifique-se que o tipo PontoTuristico tenha `photos: string[]`
import api from '@/axios/config';

// Ícone para o botão de excluir
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);

const ICONS = ['🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐'];

interface Props {
    ponto: PontoTuristico;
    onClose: () => void;
    onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

const ModalEditarPonto = ({ ponto, onClose, onAtualizado }: Props) => {
    // Estados para os campos do formulário
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconURL, setIconURL] = useState('');
    
    // Estados para gerenciamento de fotos
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Preenche o formulário quando o ponto é carregado
    useEffect(() => {
        if (ponto) {
            setName(ponto.name);
            setDescription(ponto.description);
            setIconURL(ponto.iconURL || '');
            setExistingPhotos(ponto.photos || []);
        }
    }, [ponto]);

    const handleNewPhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewPhotos(Array.from(e.target.files));
        }
    };

    // Marca uma foto existente para deleção
    const handleMarkForDeletion = (photoUrl: string) => {
        setPhotosToDelete(prev => [...prev, photoUrl]);
        setExistingPhotos(prev => prev.filter(url => url !== photoUrl));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        // Anexa dados de texto
        formData.append('name', name);
        formData.append('description', description);
        formData.append('iconURL', iconURL);

        // Anexa a lista de URLs a serem deletadas
        // O backend precisará fazer JSON.parse neste campo
        formData.append('photosToDelete', JSON.stringify(photosToDelete));

        // Anexa os novos arquivos de imagem
        newPhotos.forEach(file => {
            // A chave 'newPhotos' deve corresponder ao FilesInterceptor no backend
            formData.append('newPhotos', file);
        });

        try {
            const response = await api.put(`/places/${ponto.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onAtualizado(response.data);
            onClose();

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido.';
            setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!ponto) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[5000] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Editar Ponto Turístico</h3>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-6">
                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
                        
                        {/* Campos de texto */}
                        <div>
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" id="nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                            <div className="flex flex-wrap gap-3">
                                {ICONS.map((icon) => (
                                    <label className="cursor-pointer" key={icon}>
                                        <input type="radio" name="icon" value={icon} className="sr-only peer" checked={iconURL === icon} onChange={() => setIconURL(icon)} />
                                        <div className="text-3xl p-1 rounded-md transition-all hover:bg-gray-200 peer-checked:bg-indigo-200 ring-indigo-500 peer-checked:ring-2">{icon}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Galeria de Fotos Existentes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galeria de Imagens</label>
                            {existingPhotos.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-2">
                                    {existingPhotos.map(photoUrl => (
                                        <div key={photoUrl} className="relative group">
                                            <img src={photoUrl} alt="Ponto turístico" className="w-full h-24 object-cover rounded-md" />
                                            <button 
                                                type="button"
                                                onClick={() => handleMarkForDeletion(photoUrl)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Excluir imagem"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">Nenhuma imagem existente.</p>
                            )}
                        </div>

                        {/* Upload de Novas Imagens */}
                        <div className="mb-4">
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                Adicionar Novas Imagens
                            </label>
                            <input id="imagem" type="file" accept="image/*" multiple onChange={handleNewPhotosChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" disabled={isLoading}/>
                            {newPhotos.length > 0 && <p className="text-xs text-gray-500 mt-1">{newPhotos.length} nova(s) imagem(ns) selecionada(s).</p>}
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