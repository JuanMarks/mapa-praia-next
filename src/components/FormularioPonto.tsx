import { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Props {
    coordenadas: [number, number];
    onClose: () => void;
    onCriado: () => void;
}



const ICONS = ['🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐'];

const FormularioPonto = ({ coordenadas, onClose, onCriado }: Props) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [iconeUrl, setIconeUrl] = useState('');
    // Unificar o estado para armazenar os arquivos de imagem
    const [imagens, setImagens] = useState<File[]>([]);

    // Estados para feedback da UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Função para lidar com a seleção de múltiplos arquivos
    const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Converte o FileList (que não é um array) para um array de verdade
            setImagens(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // 1. Cria o ponto
            const res = await fetch('http://25.20.79.62:3003/pontos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    descricao,
                    latitude: coordenadas[0],
                    longitude: coordenadas[1],
                    iconeUrl: iconeUrl || "https://cdn-icons-png.flaticon.com/512/854/854878.png"
                }),
            });

            if (!res.ok) {
                throw new Error('Falha ao criar o ponto.');
            }

            const novoPonto = await res.json();

            // 2. Envia as imagens, se houver
            if (imagens.length > 0) {
                const formData = new FormData();
                imagens.forEach((imagem) => {
                    formData.append('fotos', imagem);
                });

                const resFotos = await fetch(`http://25.20.79.62:3003/pontos/${novoPonto.id}/fotos`, {
                    method: 'POST',
                    body: formData,
                });

                if (!resFotos.ok) {
                    throw new Error('Ponto criado, mas falha ao enviar as imagens.');
                }
            }

            setSuccess(true);
            setTimeout(() => {
                onCriado();
            }, 1500); // Fecha o modal após um tempo para o usuário ver a mensagem

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[5000] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded shadow-xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Adicionar novo ponto</h3>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert"><p>Ponto criado com sucesso!</p></div>}
                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}

                        <div>
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading} />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={isLoading}></textarea>
                        </div>

                        <div>
                            <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                id="tipo"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                disabled={isLoading}
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
                                {ICONS.map((icon, index) => (
                                    <label className="cursor-pointer" key={index}>
                                        <input type="radio" name="icon" value={icon} className="sr-only peer" checked={iconeUrl === icon} onChange={() => setIconeUrl(icon)} />
                                        <div className="text-3xl p-1 rounded-md transition-all duration-200 hover:bg-gray-200 peer-checked:bg-indigo-200 peer-checked:ring-2 peer-checked:ring-indigo-500">{icon}</div>
                                    </label>
                                ))}
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