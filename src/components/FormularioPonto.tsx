// Ex: app/components/FormularioPontoFirebase.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

// Funções do Firebase para Firestore e Storage
import { collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase'; // Importe suas instâncias do Firebase

// Tipagem das props
interface Props {
    coordenadas: [number, number];
    show: boolean; // Prop para controlar a visibilidade do modal
    onClose: () => void;
    onCriado: () => void;
}

// Uma lista de ícones de exemplo, se você quiser um seletor
const ICONS = ['🏛️', '🏞️', '🏖️', '🍽️', '🏨', '⛰️', '🌳', '🛍️', '⭐'];

const FormularioPontoFirebase = ({ show, coordenadas, onClose, onCriado }: Props) => {
    // Estados para os dados do formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [iconeUrl, setIconeUrl] = useState(ICONS[0]); // Começa com um ícone padrão
    const [fotos, setFotos] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
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

    const resetForm = () => {
        setNome('');
        setDescricao('');
        setIconeUrl(ICONS[0]);
        setFotos(null);
    };

    // Função principal de submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!nome || !descricao || !coordenadas) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            let urlsSalvas: string[] = [];

            // 2. Se houver imagens, faça o upload de todas em paralelo
            if (imagens.length > 0) {
                const storage = getStorage();

                // Cria um array de "promessas" de upload
                const uploadPromises = imagens.map(imagem => {
                    const imagemRef = ref(storage, `pontos/${Date.now()}_${imagem.name}`);
                    // A promessa é resolvida com a URL de download após o upload
                    return uploadBytes(imagemRef, imagem).then(snapshot => getDownloadURL(snapshot.ref));
                });

                // Promise.all espera todas as promessas serem resolvidas
                urlsSalvas = await Promise.all(uploadPromises);
            }

            // 3. Salve o documento no Firestore com o array de URLs
            await addDoc(collection(db, 'pontos'), {
                nome,
                descricao,
                latitude: coordenadas[0],
                longitude: coordenadas[1],
                iconeUrl: iconeUrl,
                imagensUrls: urlsSalvas, // Salva o array de URLs
                criadoEm: serverTimestamp(),
            });

            setSuccess(true);
            if (onCriado) onCriado(); // Chama o callback onCriado se existir
            onClose(); // Fecha o formulário após o sucesso

        } catch (err) {
            console.error("Erro ao criar ponto: ", err);
            setError('Ocorreu um erro ao salvar o ponto.');
        } finally {
            setUploading(false);
        }
    };

    // Não renderiza nada se não for para mostrar
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000] flex justify-center items-center" onClick={onClose}>
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
                            {/* 4. Adicione o atributo "multiple" ao input */}
                            <input
                                id="imagem"
                                type="file"
                                accept="image/*"
                                multiple // Permite selecionar vários arquivos
                                onChange={handleImagemChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {/* Opcional: Mostrar quantas imagens foram selecionadas */}
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

export default FormularioPontoFirebase;