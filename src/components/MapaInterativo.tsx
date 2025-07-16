// src/components/MapaInterativo.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { divIcon, icon } from 'leaflet';
import { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa';
import { PontoTuristico } from '@/types/ponto';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios

// Importando componentes
import Sidebar from './SideBar';
import LocationSearch from './RightSideBar';
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
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null); // Estado para erros do mapa

    const fetchPontos = async () => {
        try {
            setMapError(null); // Limpa erros anteriores
            const response = await api.get('/places/getPlaces');
            setPontos(response.data);
        } catch (error: unknown) { // CORRIGIDO: de 'any' para 'unknown'
            console.error("Erro ao buscar os pontos turísticos:", error);
            
            // Lógica de tratamento de erro aprimorada
            let errorMessage = 'Não foi possível carregar os pontos no mapa. Verifique sua conexão e tente recarregar a página.';

            if (isAxiosError(error) && error.response) {
                errorMessage = 'Ocorreu um erro no servidor ao buscar os locais. Tente novamente mais tarde.';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            setMapError(errorMessage);
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

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                if (isSuggesting) {
                    setSuggestionCoords([e.latlng.lat, e.latlng.lng]);
                    setIsSuggesting(false);
                    return;
                }
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
            return icon({ iconUrl: iconURL, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
        } else {
            return divIcon({ html: `<span style="font-size: 30px;">${iconURL}</span>`, className: 'emoji-icon', iconSize: [40, 40], iconAnchor: [20, 30] });
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
            pontoNormalizado.address = pontoNormalizado.address.update;
        }
        setPontos(prevPontos => prevPontos.map(p => p.id === pontoNormalizado.id ? pontoNormalizado : p));
        setSelectedPonto(pontoNormalizado);
    };

    return (
        <div className="flex h-screen w-full bg-gray-200">
            <div className={`relative flex-grow h-full transition-all duration-300 ease-in-out ${isSuggesting ? 'cursor-crosshair' : ''}`}>
                <div className='flex'>
                    <Header />
                    <div className="absolute top-24.5 left-47 sm:top-8 sm:left-310 -translate-x-1/2 w-80 max-w-md sm:max-w-lg z-[1002]">
                        <LocationSearch onLocationSelect={handleLocationSelect} />
                    </div>
                </div>
                
                <MapContainer center={centro} zoom={13} minZoom={13} maxBounds={bounds} maxBoundsViscosity={1.0} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} ref={setMap}>
                    {mapError && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-red-100 p-4 rounded-lg shadow-lg text-red-700 font-semibold">
                            {mapError}
                        </div>
                    )}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <MapClickHandler />
                    {pontos?.map((ponto) => (
                        <Marker key={ponto.id} position={[ponto.latitude, ponto.longitude]} icon={createCustomIcon(ponto.iconURL ?? '📍')}
                            eventHandlers={{ click: () => handleLocationSelect(ponto), mouseover: (e) => e.target.openPopup(), mouseout: (e) => e.target.closePopup() }}>
                            <Popup closeButton={false} autoClose={false} closeOnClick={false} autoPan={false}>
                                <PopupContent ponto={ponto} />
                            </Popup>
                            <Tooltip permanent direction="bottom" offset={[0, 10]} opacity={1} className="text-xs text-black">
                                {ponto.name}
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>

                <div className="absolute bottom-4 right-4 z-[1000]">
                    {role === 'user' && !isSuggesting && (
                        <button onClick={() => setIsSuggesting(true)} className="bg-blue-600 text-white p-3 rounded-md shadow-lg pointer-events-auto hover:bg-blue-700 flex items-center gap-2" aria-label="Sugerir novo local">
                            <FaPlus /> <span>Sugerir Local</span>
                        </button>
                    )}
                    {isSuggesting && (
                        <div className="bg-white p-3 rounded-md shadow-lg pointer-events-auto animate-pulse flex items-center gap-3">
                           <span className="text-gray-700 font-semibold">Clique no mapa para adicionar sua sugestão</span>
                           <button onClick={() => setIsSuggesting(false)} className="text-red-500 hover:text-red-700" aria-label="Cancelar sugestão">
                                <FaTimes size={20} />
                           </button>
                        </div>
                    )}
                </div>

                <div className="absolute top-20 sm:top-4 sm:right-14 right-5 z-[1002] pointer-events-none">
                    <div className="flex items-start gap-4 mt-5">
                        <button onClick={() => setIsListSidebarOpen(!isListSidebarOpen)} className="bg-white p-3 rounded-md shadow-lg pointer-events-auto text-gray-700 hover:bg-gray-100" aria-label="Mostrar lista de locais">
                            <FaBars size={20} />
                        </button>
                    </div>
                </div>

                <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} onAtualizado={handlePontoAtualizado} />
                {novaPosicao && (
                    <FormularioPonto coordenadas={novaPosicao} onClose={() => setNovaPosicao(null)} onCriado={fetchPontos} />
                )}
                {suggestionCoords && (
                    <FormularioSugestao coordenadas={suggestionCoords} onClose={() => setSuggestionCoords(null)} onSuccess={() => {
                        setSuggestionCoords(null);
                        alert("Obrigado! Sua sugestão foi enviada para análise.");
                    }} />
                )}
            </div>

            <LocationListSidebar isOpen={isListSidebarOpen} pontos={pontos} onLocationClick={handleLocationSelect} />
        </div>
    );
};

export default MapaInterativo;