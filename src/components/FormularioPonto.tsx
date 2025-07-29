import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import api from '@/axios/config';
import Image from 'next/image';
import { FaEllipsisH, FaTimes } from 'react-icons/fa';
import { isAxiosError } from 'axios';
import Cookies from 'js-cookie';
// Interface para a Categoria
interface Category {
    id: string;
    name: string;
}

interface Props {
    coordenadas: [number, number];
    onClose: () => void;
    onCriado: () => void;
}

const ICONS = [
    'https://cdn-icons-png.flaticon.com/512/7804/7804228.png',
    'https://cdn-icons-png.flaticon.com/512/6395/6395499.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448647.png',
    'https://cdn-icons-png.flaticon.com/512/9922/9922103.png',
    'https://cdn-icons-png.flaticon.com/512/5695/5695678.png',
    'https://cdn-icons-png.flaticon.com/512/7720/7720503.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448435.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448450.png',
    'https://cdn-icons-png.flaticon.com/512/5203/5203048.png',
    'https://cdn-icons-png.flaticon.com/512/3307/3307697.png',
    'https://cdn-icons-png.flaticon.com/512/3368/3368415.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448435.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448350.png',
    'https://cdn-icons-png.flaticon.com/512/17531/17531810.png',
    'https://cdn-icons-png.flaticon.com/512/17823/17823346.png',
    'https://cdn-icons-png.flaticon.com/512/3448/3448384.png',
    'https://cdn-icons-png.flaticon.com/512/5203/5203062.png',
    'https://cdn-icons-png.flaticon.com/512/10472/10472602.png',
    'https://cdn-icons-png.flaticon.com/512/18789/18789943.png',
    'https://cdn-icons-png.flaticon.com/512/5193/5193716.png',
    'https://cdn-icons-png.flaticon.com/512/18582/18582631.png',
    'https://cdn-icons-png.flaticon.com/512/4931/4931395.png'
];

const FormularioPonto = ({ coordenadas, onClose, onCriado }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [complemento, setComplemento] = useState('');
    const [imagens, setImagens] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Social Links
    const [tripadvisor, setTripadvisor] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    
    // Estados para Categoria
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState('');
    
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    // Efeito para buscar as categorias da API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
                setError("Não foi possível carregar as categorias.");
            }
        };
        fetchCategories();
    }, []);

    const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImagens(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('latitude', String(coordenadas[0]));
        formData.append('longitude', String(coordenadas[1]));
        formData.append('iconURL', iconURL || "https://cdn-icons-png.flaticon.com/512/854/854878.png");
        formData.append('categoryId', categoryId);
        formData.append('address[logradouro]', logradouro);
        formData.append('address[numero]', String(numero));
        formData.append('address[bairro]', bairro);
        formData.append('address[complemento]', complemento);
        formData.append('socialLinks[tripadvisor]', tripadvisor);
        formData.append('socialLinks[whatsapp]', whatsapp);
        formData.append('socialLinks[instagram]', instagram);
        formData.append('socialLinks[email]', email);
        formData.append('socialLinks[website]', website);
        imagens.forEach((imagem) => {
            formData.append('photos', imagem);
        });

        const token = Cookies.get('token');
       try {
            const res = await api.post('/places/createPlace', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${token}`
                },
                
            });

            console.log(res.data);
            setSuccess(true);
            setTimeout(() => {
                onCriado();
            }, 1500);

        } catch (err: unknown) { // CORRIGIDO: de 'any' para 'unknown'
            console.error("Erro detalhado ao criar ponto:", err);
            
            // Lógica de tratamento de erro aprimorada
            let errorMessage = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';

            if (isAxiosError(err)) {
                if (err.response) {
                    const serverMessage = err.response.data?.message;
                    // Lida com mensagens que podem ser um array (comum em erros de validação do class-validator)
                    errorMessage = Array.isArray(serverMessage) ? serverMessage.join('. ') : serverMessage || `Erro ${err.response.status}: Falha ao processar a solicitação.`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);

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

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Adicionar novo ponto</h3>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="" autoComplete="off">
                    <div className="p-4 space-y-3">
                        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>Ponto criado com sucesso!</p></div>}
                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}

                        <div>
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" id="nome" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading}></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="bairro" className="block mb-2 text-sm font-medium text-gray-700">Bairro</label>
                                <input type="text" id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-700">Número</label>
                                <input type="number" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="logradouro" className="block mb-2 text-sm font-medium text-gray-700">Logradouro</label>
                                <input type="text" id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                            </div>
                            <div>
                                <label htmlFor="complemento" className="block mb-2 text-sm font-medium text-gray-700">Complemento</label>
                                <input type="text" id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                            </div>
                        </div>

                        {/* Campo de Redes Sociais */}
                        <div>
                            <label htmlFor="social" className="block mb-2 text-sm font-medium text-gray-700">Redes Sociais</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tripadvisor" className="block mb-2 text-sm font-medium text-gray-700">Tripadvisor</label>
                                    <input type="text" id="tripadvisor" value={tripadvisor} onChange={(e) => setTripadvisor(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                                </div>
                                <div>
                                    <label htmlFor="whatsapp" className="block mb-2 text-sm font-medium text-gray-700">WhatsApp</label>
                                    <input type="text" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                                </div>
                                <div>
                                    <label htmlFor="instagram" className="block mb-2 text-sm font-medium text-gray-700">Instagram</label>
                                    <input type="text" id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-700">Website</label>
                                    <input type="text" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                                </div>
                            </div>
                        </div>

                        {/* Campo de Categoria */}
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
                        
                        {/* O campo de rating foi removido do formulário de criação */}
                        
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
                                    <FaEllipsisH className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                Imagens do Ponto (Opcional)
                            </label>
                            <input
                                id="imagem"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagemChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                disabled={isLoading}
                            />
                            {imagens.length > 0 && (
                                <p className="mt-1 text-xs text-gray-500">{imagens.length} imagem(ns) selecionada(s)</p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Local: {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}</p>
                    </div>

                    <div className="flex items-center justify-end p-4 space-x-2 border-t border-gray-200 rounded-b">
                        <button type="button" onClick={onClose} disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400 disabled:cursor-not-allowed">{isLoading ? 'Salvando...' : 'Salvar'}</button>
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

export default FormularioPonto;