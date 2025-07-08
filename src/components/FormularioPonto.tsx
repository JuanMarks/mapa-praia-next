import { useState, ChangeEvent, FormEvent } from 'react';
import api from '@/axios/config';
import Image from 'next/image';
interface Props {
    coordenadas: [number, number];
    onClose: () => void;
    onCriado: () => void;
}

const ICONS = [ '🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐', '🍦', '🍻',
    'https://cdn-icons-png.flaticon.com/512/3448/3448609.png', // Exemplo: Restaurante
    'https://cdn-icons-png.flaticon.com/512/2923/2923500.png', // Exemplo: Sorvete
    'https://cdn-icons-png.flaticon.com/512/854/854878.png',   // Exemplo: Ponto no mapa
    'https://cdn-icons-png.flaticon.com/512/1046/1046751.png', // Exemplo: Praia
    'https://cdn-icons-png.flaticon.com/512/4901/4901802.png',
    'https://cdn-icons-png.flaticon.com/512/2271/2271030.png',
    'https://cdn-icons-png.flaticon.com/512/4287/4287284.png',
    'https://cdn-icons-png.flaticon.com/512/6978/6978255.png',
    'https://cdn-icons-png.flaticon.com/512/1669/1669668.png',
    'https://cdn-icons-png.flaticon.com/512/3656/3656972.png',
    'https://cdn-icons-png.flaticon.com/512/10415/10415475.png',
    'https://cdn-icons-png.flaticon.com/512/814/814405.png',
    'https://cdn-icons-png.flaticon.com/512/16438/16438096.png',
    //;
]
const FormularioPonto = ({ coordenadas, onClose, onCriado }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [iconURL, setIconURL] = useState('');
    const [type, setType] = useState('');
    const [rating, setRating] = useState<number>(1); // Inicia com 1
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [complemento, setComplemento] = useState('');
    const [imagens, setImagens] = useState<File[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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

        // 1. Criar um objeto FormData para enviar dados de formulário e arquivos
        const formData = new FormData();

        // 2. Anexar todos os campos de texto e outros dados
        formData.append('name', name);
        formData.append('description', description);
        formData.append('latitude', String(coordenadas[0]));
        formData.append('longitude', String(coordenadas[1]));
        formData.append('iconURL', iconURL || "https://cdn-icons-png.flaticon.com/512/854/854878.png");
        formData.append('type', type || 'outro');
        formData.append('rating', String(rating));

        // Para objetos aninhados como 'address', anexe cada propriedade individualmente
        // O NestJS irá reconstruir o objeto no DTO
        formData.append('address[logradouro]', logradouro);
        formData.append('address[numero]', String(numero));
        formData.append('address[bairro]', bairro);
        formData.append('address[complemento]', complemento);


        // 3. Anexar cada arquivo de imagem
        imagens.forEach((imagem) => {
            // O nome do campo 'photos' deve corresponder ao usado no FilesInterceptor do NestJS
            formData.append('photos', imagem);
        });

        try {
            // 4. Enviar tudo em uma única requisição POST
            const res = await api.post('/places/createPlace', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(res.data);
            setSuccess(true);
            setTimeout(() => {
                onCriado(); // Chama a função para fechar o modal e atualizar a lista
            }, 1500);

        } catch (err: any) {
            console.error("Erro ao criar ponto:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido.';
            setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[5010] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Adicionar novo ponto</h3>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3">
                        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>Ponto criado com sucesso!</p></div>}
                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}

                        {/* ... o restante do seu formulário permanece igual ... */}
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
                                <input type="text" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
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

                        <div>
                            <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                id="tipo"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                disabled={isLoading}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="restaurante">Restaurante</option>
                                <option value="sorveteria">Sorveteria</option>
                                <option value="praia">Praia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone do Marcador</label>
                            <div className="flex flex-wrap gap-3">
                                {ICONS.map((icon, index) => {
                                    // Verifica se o item da lista é uma URL
                                    const isUrl = icon.startsWith('http');

                                    return (
                                        <label className="cursor-pointer" key={index}>
                                            <input type="radio" name="icon" value={icon} className="sr-only peer" checked={iconURL === icon} onChange={() => setIconURL(icon)} />
                                            {/* Define um tamanho fixo para alinhar emojis e imagens */}
                                            <div className="h-12 w-12 flex items-center justify-center p-1 rounded-md transition-all duration-200 hover:bg-gray-200 peer-checked:bg-indigo-200 peer-checked:ring-2 peer-checked:ring-indigo-500">
                                                {isUrl ? (
                                                    // Se for URL, renderiza a imagem
                                                    <Image src={icon} alt="Ícone" width={32} height={32} className="object-contain" />
                                                ) : (
                                                    // Se não for, renderiza o emoji
                                                    <span className="text-3xl">{icon}</span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
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
                        <button type="button" onClick={onClose} disabled={isLoading} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-400 disabled:cursor-not-allowed">{isLoading ? 'Salvando...' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioPonto;