// src/components/FormularioSugestao.tsx
'use client';

import { useState, FormEvent } from 'react';
import api from '@/axios/config';
import Cookies from 'js-cookie';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios

interface Props {
    coordenadas: [number, number];
    onClose: () => void;
    onSuccess: () => void;
}

const FormularioSugestao = ({ coordenadas, onClose, onSuccess }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const token = Cookies.get('token');
        if (!token) {
            setError("Você precisa estar logado para enviar uma sugestão.");
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/suggestions', {
                name,
                description,
                latitude: coordenadas[0],
                longitude: coordenadas[1],
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            onSuccess();

        } catch (err: unknown) { // CORRIGIDO: de 'any' para 'unknown'
            console.error("Erro detalhado ao enviar sugestão:", err);
            
            // Lógica de tratamento de erro aprimorada
            let errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';

            if (isAxiosError(err)) {
                if (err.response) {
                    const status = err.response.status;
                    const serverMessage = err.response.data?.message;

                    if (status === 401 || status === 403) {
                        errorMessage = 'Sua sessão expirou. Por favor, faça login novamente para continuar.';
                    } else {
                        // Lida com mensagens de erro que podem ser um array (validação)
                        errorMessage = Array.isArray(serverMessage) 
                            ? serverMessage.join('. ') 
                            : serverMessage || `Ocorreu um erro no servidor (código: ${status}).`;
                    }
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[5020] flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Sugerir um Novo Local</h3>
                    <button onClick={onClose} className="text-gray-400 p-1.5 rounded-full hover:bg-gray-200">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded">
                                <p className="text-sm font-semibold">{error}</p>
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="sug-nome" className="block mb-1 text-sm font-medium text-gray-700">Nome do Local</label>
                            <input 
                                type="text" 
                                id="sug-nome" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
                                disabled={isLoading} 
                            />
                        </div>

                        <div>
                            <label htmlFor="sug-desc" className="block mb-1 text-sm font-medium text-gray-700">Por que este local é interessante?</label>
                            <textarea 
                                id="sug-desc" 
                                rows={3} 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
                                disabled={isLoading}
                            ></textarea>
                        </div>
                        
                        <p className="text-xs text-gray-500">Coordenadas: {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}</p>
                    </div>

                    <div className="flex items-center justify-end p-4 border-t">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 mr-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                            {isLoading ? 'Enviando...' : 'Enviar Sugestão'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioSugestao;