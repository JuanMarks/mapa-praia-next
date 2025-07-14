import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PontoTuristico } from '@/types/ponto';
import api from '@/axios/config';
import Image from 'next/image';
import { FaEllipsisH, FaTimes } from 'react-icons/fa';

// Interface para a Categoria
interface Category {
    id: string;
    name: string;
}

// Ícone para o botão de excluir
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);

const ICONS = ['🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐', '🍦', '🍻',
    'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    'https://cdn-icons-png.flaticon.com/512/2923/2923500.png',
    'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    'https://cdn-icons-png.flaticon.com/512/1046/1046751.png',
    'https://cdn-icons-png.flaticon.com/512/4901/4901802.png',
    'https://cdn-icons-png.flaticon.com/512/2271/2271030.png',
    'https://cdn-icons-png.flaticon.com/512/4287/4287284.png',
    'https://cdn-icons-png.flaticon.com/512/6978/6978255.png',
    'https://cdn-icons-png.flaticon.com/512/1669/1669668.png',
    'https://cdn-icons-png.flaticon.com/512/3656/3656972.png',
    'https://cdn-icons-png.flaticon.com/512/10415/10415475.png',
    'https://cdn-icons-png.flaticon.com/512/814/814405.png',
    'https://cdn-icons-png.flaticon.com/512/16438/16438096.png',
    'https://cdn-icons-png.flaticon.com/512/1138/1138048.png',
    'https://cdn-icons-png.flaticon.com/512/1946/1946788.png'
];

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
    const [rating, setRating] = useState<number>(1);
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [complemento, setComplemento] = useState('');
    
    // Estados para Categoria
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState('');

    // Estados para gerenciamento de fotos
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    // Efeito para buscar as categorias e preencher o formulário
    useEffect(() => {
        const fetchCategoriesAndSetPonto = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
                setError("Não foi possível carregar as categorias.");
            }

            if (ponto) {
                setName(ponto.name);
                setDescription(ponto.description);
                setIconURL(ponto.iconURL || '');
                setExistingPhotos(ponto.photos || []);
                setRating(ponto.averageRating || 1);
                setBairro(ponto.address?.bairro || '');
                setNumero(ponto.address?.numero || '');
                setLogradouro(ponto.address?.logradouro || '');
                setComplemento(ponto.address?.complemento || '');
                setCategoryId(ponto.categoryId || ''); // Define a categoria atual
            }
        };

        fetchCategoriesAndSetPonto();
    }, [ponto]);

    const handleNewPhotosChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewPhotos(Array.from(e.target.files));
        }
        console.log('Novas fotos selecionadas:', newPhotos);
    };

    const handleMarkForDeletion = (photoUrl: string) => {
        setPhotosToDelete(prev => [...prev, photoUrl]);
        setExistingPhotos(prev => prev.filter(url => url !== photoUrl));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        // Anexa os dados que podem ser atualizados
        formData.append('name', name);
        formData.append('description', description);
        formData.append('iconURL', iconURL);
        formData.append('categoryId', categoryId); // Garante que a categoria seja enviada

        // Endereço
        formData.append('address[logradouro]', logradouro);
        formData.append('address[numero]', String(numero));
        formData.append('address[bairro]', bairro);
        formData.append('address[complemento]', complemento);

        // Gerenciamento de fotos
        formData.append('photosToDelete', JSON.stringify(photosToDelete));
        newPhotos.forEach(file => {
            formData.append('photos', file);
        });
        
        // O campo 'rating' FOI REMOVIDO daqui.

        try {
            const response = await api.put(`/places/${ponto.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onAtualizado(response.data);
            console.log('Ponto atualizado com sucesso:', response.data);
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido.';
            setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIconSelect = (selectedIcon: string) => {
        setIconURL(selectedIcon);
        setIsIconModalOpen(false);
    };
    
    const visibleIcons = ICONS.slice(0, 5);
    const hiddenIcons = ICONS.slice(5);

    if (!ponto) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[5010] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
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
                            <input type="text" id="nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading}></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-700">Avaliação (1 a 5)</label>
                                <input 
                                    type="number" 
                                    id="rating" 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))} 
                                    min="1" max="5" 
                                    step="0.1"
                                    required 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" 
                                    disabled={isLoading} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="logradouro" className="block mb-2 text-sm font-medium text-gray-700">Logradouro</label>
                                <input type="text" id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                            </div>
                             <div>
                                <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-700">Número</label>
                                <input type="text" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="bairro" className="block mb-2 text-sm font-medium text-gray-700">Bairro</label>
                                <input type="text" id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="complemento" className="block mb-2 text-sm font-medium text-gray-700">Complemento</label>
                                <input type="text" id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" disabled={isLoading} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                            <div className="flex flex-wrap items-center gap-3">
                                {visibleIcons.map((icon, index) => {
                                    const isUrl = icon.startsWith('http');
                                    return (
                                        <label className="cursor-pointer" key={index}>
                                            <input type="radio" name="icon" value={icon} className="sr-only peer" checked={iconURL === icon} onChange={() => setIconURL(icon)} />
                                            <div className="h-12 w-12 flex items-center justify-center p-1 rounded-md transition-all duration-200 hover:bg-gray-200 peer-checked:bg-indigo-200 peer-checked:ring-2 peer-checked:ring-indigo-500">
                                                {isUrl ? <Image src={icon} alt="Ícone" width={32} height={32} className="object-contain" /> : <span className="text-3xl">{icon}</span>}
                                            </div>
                                        </label>
                                    );
                                })}
                                <button 
                                    type="button"
                                    onClick={() => setIsIconModalOpen(true)}
                                    className="h-12 w-12 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                                >
                                    <FaEllipsisH className="text-gray-600"/>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galeria de Imagens</label>
                            {existingPhotos.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-2">
                                    {existingPhotos.map(photoUrl => (
                                        <div key={photoUrl} className="relative group">
                                            <Image src={photoUrl} alt="Ponto turístico" width={100} height={100} className="w-full h-24 object-cover rounded-md" />
                                            <button type="button" onClick={() => handleMarkForDeletion(photoUrl)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Excluir imagem">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-gray-500 mt-2">Nenhuma imagem existente.</p>}
                        </div>
                        <div>
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">Adicionar Novas Imagens</label>
                            <input id="imagem" type="file" accept="image/*" multiple onChange={handleNewPhotosChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" disabled={isLoading} />
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
            {isIconModalOpen && (
                <div 
                    className="absolute inset-0 bg-black/30 z-20 flex justify-center items-center"
                    onClick={() => setIsIconModalOpen(false)}
                >
                    <div 
                        className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg">Selecione um Ícone</h4>
                            <button type="button" onClick={() => setIsIconModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="grid grid-cols-6 gap-3 max-h-60 overflow-y-auto">
                            {hiddenIcons.map((icon, index) => {
                                const isUrl = icon.startsWith('http');
                                return (
                                    <button 
                                        type="button" 
                                        key={index} 
                                        onClick={() => handleIconSelect(icon)}
                                        className="h-12 w-12 flex items-center justify-center p-1 rounded-md transition-all duration-200 hover:bg-gray-200"
                                    >
                                        {isUrl ? <Image src={icon} alt="Ícone" width={32} height={32} className="object-contain" /> : <span className="text-3xl">{icon}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalEditarPonto;