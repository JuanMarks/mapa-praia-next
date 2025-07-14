'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { divIcon, icon } from 'leaflet';
import { useState, useEffect } from 'react';
// Ícones adicionados: FaPlus para o botão de sugerir e FaTimes para o de cancelar
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa';

import { PontoTuristico } from '@/types/ponto';
import 'leaflet/dist/leaflet.css';
import '../pages/globals.css';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';

// Importando todos os seus componentes
import Sidebar from './SideBar';

import LocationListSidebar from './LocationListSideBar';
import FormularioPonto from './FormularioPonto';
import FormularioSugestao from './FormularioSugestao';
import PopupContent from './PopupContent';
import Header from './Header';
const centro: [number, number] = [-2.900, -40.15];
const bounds: [[number, number], [number, number]] = [
    [-3.128981, -39.833362],
    [-2.965702, -39.527987],
];

const MapaInterativo = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [novaPosicao, setNovaPosicao] = useState<[number, number] | null>(null);
    const [suggestionCoords, setSuggestionCoords] = useState<[number, number] | null>(null);
    const { role } = useAuth();
    const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const [isListSidebarOpen, setIsListSidebarOpen] = useState(false);
    
    // --- NOVO ESTADO PARA CONTROLAR O "MODO DE SUGESTÃO" ---
    const [isSuggesting, setIsSuggesting] = useState(false);

    // ... (funções fetchPontos, useEffects, createCustomIcon, etc. continuam iguais)
    const fetchPontos = async () => {
        try {
            const response = await api.get('/places/getPlaces');
            setPontos(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar pontos:', error.message);
            setPontos([]);
        }
    };
    
    useEffect(() => {
        fetchPontos();
    }, []);

    useEffect(() => {
        if (selectedPonto && map) {
            map.flyTo([selectedPonto.latitude, selectedPonto.longitude], 17);
        }
    }, [selectedPonto, map]);

    // --- LÓGICA DO CLIQUE NO MAPA ATUALIZADA ---
    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                // Se o modo de sugestão estiver ativo, abre o formulário de sugestão
                if (isSuggesting) {
                    setSuggestionCoords([e.latlng.lat, e.latlng.lng]);
                    setIsSuggesting(false); // Desativa o modo de sugestão após o clique
                    return; // Interrompe a execução para não cair em outras condições
                }

                // Se o usuário for admin e não houver ponto selecionado, abre o formulário de criação
                if (role === 'admin' && !selectedPonto) {
                    setNovaPosicao([e.latlng.lat, e.latlng.lng]);
                }
            },
        });
        return null;
    };

    const createCustomIcon = (iconURL: string) => {
        const isUrl = iconURL.startsWith('http') || iconURL.startsWith('/');
        if (isUrl) {
            return icon({
                iconUrl: iconURL,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            });
        } else {
            return divIcon({
                html: `<span style="font-size: 30px;">${iconURL}</span>`,
                className: 'emoji-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 30],
            });
        }
    };
    
    const handleLocationSelect = (ponto: PontoTuristico) => {
        setSelectedPonto(ponto);
        setIsListSidebarOpen(false);
    };

    const handleSidebarClose = () => {
        setSelectedPonto(null);
    };

    const handlePontoAtualizado = (pontoAtualizado: PontoTuristico) => {
        const pontoNormalizado = { ...pontoAtualizado };
        if (pontoNormalizado.address && 'update' in pontoNormalizado.address) {
            // @ts-ignore
            pontoNormalizado.address = pontoNormalizado.address.update;
        }
        setPontos(prevPontos => prevPontos.map(p => p.id === pontoNormalizado.id ? pontoNormalizado : p));
        setSelectedPonto(pontoNormalizado);
    };

    return (
        <div className="flex h-screen w-full bg-gray-200">
            
            <div className={`relative flex-grow h-full transition-all duration-300 ease-in-out ${isSuggesting ? 'cursor-crosshair' : ''}`}>
                <Header />
                <MapContainer
                    center={centro}
                    zoom={13}
                    minZoom={13}
                    maxBounds={bounds}
                    maxBoundsViscosity={1.0}
                    scrollWheelZoom={true} // Habilitado para melhor usabilidade
                    style={{ height: '100%', width: '100%' }}
                    ref={setMap}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    
                    <MapClickHandler />

                    {pontos?.map((ponto) => (
                        <Marker
                            key={ponto.id}
                            position={[ponto.latitude, ponto.longitude]}
                            icon={createCustomIcon(ponto.iconURL ?? '📍')}
                            eventHandlers={{
                                click: () => handleLocationSelect(ponto),
                                mouseover: (e) => e.target.openPopup(),
                                mouseout: (e) => e.target.closePopup(),
                            }}
                        >
                            <Popup closeButton={false} autoClose={false} closeOnClick={false} autoPan={false}>
                                <PopupContent ponto={ponto} />
                            </Popup>
                            <Tooltip
                                permanent
                                direction="bottom"
                                offset={[0, 10]}
                                opacity={1}
                                className="text-xs text-black"
                            >
                                {ponto.name}
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>

                {/* --- NOVOS BOTÕES DE SUGESTÃO E CANCELAMENTO --- */}
                <div className="absolute bottom-4 right-4 z-[1000]">
                    {/* Botão para INICIAR a sugestão (só aparece para usuários logados) */}
                    {role === 'user' && !isSuggesting && (
                        <button
                            onClick={() => setIsSuggesting(true)}
                            className="bg-blue-600 text-white p-3 rounded-md shadow-lg pointer-events-auto hover:bg-blue-700 flex items-center gap-2"
                            aria-label="Sugerir novo local"
                        >
                            <FaPlus />
                            <span>Sugerir Local</span>
                        </button>
                    )}

                    {/* Barra para CANCELAR a sugestão (só aparece quando o modo está ativo) */}
                    {isSuggesting && (
                        <div className="bg-white p-3 rounded-md shadow-lg pointer-events-auto animate-pulse flex items-center gap-3">
                           <span className="text-gray-700 font-semibold">Clique no mapa para adicionar sua sugestão</span>
                           <button onClick={() => setIsSuggesting(false)} className="text-red-500 hover:text-red-700" aria-label="Cancelar sugestão">
                                <FaTimes size={20} />
                           </button>
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
                    <div className="flex items-start gap-4 mt-5">
                        <button 
                            onClick={() => setIsListSidebarOpen(!isListSidebarOpen)}
                            className="bg-white p-3 rounded-md shadow-lg pointer-events-auto text-gray-700 hover:bg-gray-100"
                            aria-label="Mostrar lista de locais"
                        >
                            <FaBars size={20} />
                        </button>
                        
                    </div>
                </div>

                <Sidebar 
                    ponto={selectedPonto} 
                    onClose={handleSidebarClose} 
                    onAtualizado={handlePontoAtualizado}
                />

                {novaPosicao && (
                    <FormularioPonto
                        coordenadas={novaPosicao}
                        onClose={() => setNovaPosicao(null)}
                        onCriado={() => {
                            setNovaPosicao(null);
                            fetchPontos();
                        }}
                    />
                )}
                
                {suggestionCoords && (
                    <FormularioSugestao
                        coordenadas={suggestionCoords}
                        onClose={() => setSuggestionCoords(null)}
                        onSuccess={() => {
                            setSuggestionCoords(null);
                            alert("Obrigado! Sua sugestão foi enviada para análise.");
                        }}
                    />
                )}
            </div>

            <LocationListSidebar 
                isOpen={isListSidebarOpen}
                pontos={pontos}
                onLocationClick={handleLocationSelect}
            />
        </div>
    );
};

export default MapaInterativo;