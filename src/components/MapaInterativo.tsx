'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { divIcon, icon } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';

import { PontoTuristico } from '@/types/ponto';
import 'leaflet/dist/leaflet.css';
import '../pages/globals.css';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';

// Importando todos os seus componentes
import Sidebar from './SideBar';
import RightSidebar from './RightSideBar';
import LocationListSidebar from './LocationListSideBar';
import FormularioPonto from './FormularioPonto';
import PopupContent from './PopupContent'; // Importando o PopupContent

// Correção dos ícones (código mantido)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

const centro: [number, number] = [-2.900, -40.15];
const bounds: [[number, number], [number, number]] = [
    [-3.128981, -39.833362],
    [-2.965702, -39.527987],
];

const MapaInterativo = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [novaPosicao, setNovaPosicao] = useState<[number, number] | null>(null);
    const { role } = useAuth();
    const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const [isListSidebarOpen, setIsListSidebarOpen] = useState(false);

    // ... (todas as suas funções como fetchPontos, handleLocationSelect, etc. continuam aqui)
    const fetchPontos = async () => {
        try {
            const response = await api.get('/places/getPlaces');
            setPontos(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar pontos:', error.message);
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
                if (role === 'admin') {
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
        
        {/* Container do Mapa (agora vem primeiro, ocupando a esquerda) */}
        <div className="relative flex-grow h-full transition-all duration-300 ease-in-out">
            <MapContainer
                center={centro}
                zoom={13}
                minZoom={13}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={false}
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

            {/* Componentes Flutuantes (continuam sobre o mapa) */}
            <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
                <div className="flex items-start gap-4 mt-5">
                    <button 
                        onClick={() => setIsListSidebarOpen(!isListSidebarOpen)}
                        className="bg-white p-3 rounded-md shadow-lg pointer-events-auto text-gray-700 hover:bg-gray-100"
                        aria-label="Mostrar lista de locais"
                    >
                        <FaBars size={20} />
                    </button>
                    <div className="flex-grow pointer-events-auto">
                        <RightSidebar onLocationSelect={handleLocationSelect} />
                    </div>
                </div>
            </div>

            {/* Sidebar de Detalhes (continua flutuando na esquerda) */}
            <Sidebar 
                ponto={selectedPonto} 
                onClose={handleSidebarClose} 
                onAtualizado={handlePontoAtualizado}
            />

            {/* Formulário para criar novo ponto */}
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
        </div>

        {/* Sidebar da Direita (agora vem por último, ocupando a direita) */}
        <LocationListSidebar 
            isOpen={isListSidebarOpen}
            pontos={pontos}
            onLocationClick={handleLocationSelect}
        />
    </div>
);
};

export default MapaInterativo;