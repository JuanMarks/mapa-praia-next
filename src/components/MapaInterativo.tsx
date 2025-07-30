// src/components/MapaInterativo.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { divIcon, icon } from 'leaflet';
import { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa';
import { PontoTuristico } from '@/types/ponto';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios
import { useTideData } from '../hooks/useTideData';
import mareData from '../data/tabua-mares-2025.json';
// import Link from 'next/link';
// import Image from 'next/image';
// Importando componentes
import Sidebar from './SideBar';
import LocationSearch from './RightSideBar';
import LocationListSidebar from './LocationListSideBar';
import FormularioPonto from './FormularioPonto';
import FormularioSugestao from './FormularioSugestao';
import PopupContent from './PopupContent';
import Header from './Header';
import TideStatusIcon from './TideStatusIcon';
import TideDayModal from './TideDayModal';
import MobileBottomBar from './MobileBottomBar';
import BottomLeftLogo from './BottomLeftLogo';
import FloatingStarButton from './StarBottomAtal';

const centro: [number, number] = [-3.07414635412766, -39.657204795003985];
const bounds: [[number, number], [number, number]] = [
  [-2.9645931074537804, -39.732843894186985],
  [-3.163798686440656, -39.535951274441054],
];
   interface MapaInterativoProps {
  pontoSelecionado?: PontoTuristico | null;
}
const MapaInterativo: React.FC<MapaInterativoProps> = ({ pontoSelecionado }) => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [novaPosicao, setNovaPosicao] = useState<[number, number] | null>(null);
    const [suggestionCoords, setSuggestionCoords] = useState<[number, number] | null>(null);
    const { role } = useAuth();
    const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const [currentZoom, setCurrentZoom] = useState<number>(13);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null); // Estado para erros do mapa
    const { maresDoDia } = useTideData();
    const [isTideModalOpen, setIsTideModalOpen] = useState(false);
    const [isPaneReady, setIsPaneReady] = useState(false);
    const [isListSidebarOpen, setIsListSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 640; // true no desktop, false no mobile

        }
        return true; // fallback para SSR
        });
    const fetchPontos = async () => {
        try {
            setMapError(null);
            const response = await api.get('/places/getPlaces');
            setPontos(response.data);
            console.log("Pontos carregados:", response.data);
        } catch (err: unknown) { // CORRIGIDO: de 'any' para 'unknown'
            console.error("Erro ao buscar os pontos turísticos:", err);
            
            let errorMessage = 'Não foi possível carregar os pontos no mapa. Verifique sua conexão e tente recarregar a página.';

            if (isAxiosError(err) && err.response) {
                errorMessage = 'Ocorreu um erro no servidor ao buscar os locais. Tente novamente mais tarde.';
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setMapError(errorMessage);
            setPontos([]);
        }
    };
    useEffect(() => {
  if (pontoSelecionado && map) {
    map.flyTo([pontoSelecionado.latitude, pontoSelecionado.longitude], 17);
    setSelectedPonto(pontoSelecionado);
    setIsListSidebarOpen(false);
  }
}, [pontoSelecionado, map]);
    useEffect(() => {
        
        fetchPontos();
    }, []);

    useEffect(() => {
        if (selectedPonto && map) {
            map.flyTo([selectedPonto.latitude, selectedPonto.longitude], 17);
        }
    }, [selectedPonto, map]);

    useEffect(() => {
        if (!map) return;
        const updateZoom = () => {
            const zoom = map.getZoom();
            if (typeof zoom === 'number') {
                setCurrentZoom(zoom);
            }
        };
        map.on('zoomend', updateZoom);
        updateZoom();
        return () => {
            map.off('zoomend', updateZoom);
        };
    }, [map]);

    useEffect(() => {
        if (map) {
            // Cria um novo 'pane' para o nosso ícone da maré
            // O zIndex de 499 garante que ele fique abaixo dos modais (z-5000+),
            // mas acima dos painéis do mapa (que vão até ~400).
            map.createPane('tideIconPane');
            const pane = map.getPane('tideIconPane');
            if (pane) {
                pane.style.zIndex = '500';
                setIsPaneReady(true);
            }
        }
    }, [map]);

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
        return icon({
        iconUrl: iconURL,
        iconSize: [40, 40],         // aumente se necessário
        iconAnchor: [20, 40],       // base central do ícone
        popupAnchor: [0, -35],      // ajusta posição do popup
        });
    }
    return divIcon({
        html: `<span style="font-size: 32px;">${iconURL}</span>`,
        className: 'emoji-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
    });
    };

    const handleLocationSelect = (ponto: PontoTuristico | null) => {
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

        if (pontoNormalizado.socialLinks && 'update' in pontoNormalizado.socialLinks) {
            pontoNormalizado.socialLinks = pontoNormalizado.socialLinks.update;
        }
        setPontos(prev => prev.map(p => p.id === pontoNormalizado.id ? pontoNormalizado : p));
        setSelectedPonto(pontoNormalizado);
    };

    const createLabelIcon = (nome : string) => {
        return  divIcon({
                    className: 'custom-label-icon tracking-wider', // Classe para remover estilos padrão
                    html: `<span class="map-label-text">${nome}</span>`,
                    iconSize: [100, 20], // Ajuste o tamanho conforme necessário
                    iconAnchor: [-20, 35]  // Posição relativa ao marcador principal
                });
    }

    const adjustZoomForMobile = () => {
        if (map) {
            const isMobile = window.innerWidth < 768; // Exemplo: 768px como breakpoint para mobile
            if (isMobile) {
                map.setMinZoom(11); 
                map.setMaxZoom(18);
                if (map.getZoom() > 18) { // Se o zoom atual for muito alto para mobile, ajusta
                    map.setZoom(18);
                }
            } else {
                map.setMinZoom(13);
                map.setMaxZoom(18);
            }
        }
    };

    useEffect(() => {
        if (map) {
            adjustZoomForMobile();
            window.addEventListener('resize', adjustZoomForMobile);
            return () => {
                window.removeEventListener('resize', adjustZoomForMobile);
            };
        }
    }, [map]);


    

    return (
        <div className="flexw-full h-[90vh] md:h-screen lg:h-screen relative bg-gray-200">
            <div className={`relative flex-grow h-full transition-all duration-300 ease-in-out ${isSuggesting ? 'cursor-crosshair' : ''}`}>
                
                <div className='flex'>
                    <div className='hidden sm:block'>
                        <Header />
                    </div>
                    
                    <div
  className="
    absolute
    top-5 sm:top-[120px] lg:top-8
    left-2 sm:left-auto lg:right-0
    sm:right-0
    sm:translate-x-0
    lg:translate-x-0
    w-[80%] sm:w-[300px] lg:w-[400px]
    z-[1002]
  "
>
  <LocationSearch onLocationSelect={handleLocationSelect} />
</div>
                </div>
                
                <MapContainer center={centro} zoom={11} minZoom={11} maxBounds={bounds} maxBoundsViscosity={1.0} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} ref={setMap} zoomControl={false}>
                    {mapError && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-red-100 p-4 rounded-lg shadow-lg text-center">
                            <p className="font-bold text-red-700">Falha ao Carregar o Mapa</p>
                            <p className="text-sm text-red-600 mt-1">{mapError}</p>
                        </div>
                    )}
                    
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    
                    <MapClickHandler />
                    {isPaneReady && (
                        <>
                            <TideStatusIcon 
                                position={[-3.00818, -39.66286]} // Posição fixa no "mar" do mapa
                                onClick={() => setIsTideModalOpen(true)}
                                pane="tideIconPane" // Usando o pane customizado
                            />

                            <TideStatusIcon 
                                position={[-2.99550, -39.72106]} // Posição fixa no "mar" do mapa
                                onClick={() => setIsTideModalOpen(true)}
                                pane="tideIconPane" // Usando o pane customizado
                            />

                            <TideStatusIcon 
                                position={[-3.04912, -39.57949]} // Posição fixa no "mar" do mapa
                                onClick={() => setIsTideModalOpen(true)}
                                pane="tideIconPane" // Usando o pane customizado
                            />
                        </>
                    )}
                    

                    
                    

                    {pontos.map((ponto) => (
                        <>
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
                                <Popup closeButton={false} autoClose={false} closeOnClick={false} autoPan={false} className="map-popup">
                                    <PopupContent ponto={ponto} />
                                </Popup>
                                
                            </Marker>

                            <Marker
                                key={`${ponto.id}-label`}
                                position={[ponto.latitude, ponto.longitude]}
                                icon={createLabelIcon(ponto.name)}
                                interactive={false} // Faz com que o rótulo não seja clicável
                                
                            />
                        </>
                    ))}
                </MapContainer>

                <div className="absolute z-[1000] left-3 top-30 hidden sm:flex flex-col shadow-lg rounded-2xl overflow-hidden"> {/* MODIFICADO AQUI: left-3 e top-20 */}
                    <button
                        onClick={() => map?.zoomIn()}
                        disabled={currentZoom === map?.getMaxZoom()}
                        className="w-10 h-10 flex items-center justify-center text-xl bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Aumentar zoom"
                    >
                        +
                    </button>
                    <button
                        onClick={() => map?.zoomOut()}
                        disabled={currentZoom === map?.getMinZoom()}
                        className="w-10 h-10 flex items-center justify-center text-xl bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Reduzir zoom"
                    >
                        -
                    </button>
                </div>

                <div className="absolute bottom-4 right-5 z-[1000]">
                    <div className='sm:flex absolute sm:bottom-6 bottom-5 right-0 z-[1002]'>
                        {role === 'user' && !isSuggesting && (
                            <button onClick={() => setIsSuggesting(true)} className="bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg hover:bg-gray-100" aria-label="Sugerir novo local">
                                <span className='text-gray-700'>
                                <FaPlus />
                                </span>
                            </button>
                        )}
                    </div>
                    {isSuggesting && (
                        <div className="bg-white absolute bottom-2 z-[3000] right-0 w-60 p-3 rounded-md shadow-lg pointer-events-auto animate-pulse flex items-center gap-3">
                           <span className="text-gray-700 font-semibold">Clique no mapa para adicionar sua sugestão</span>
                           <button onClick={() => setIsSuggesting(false)} className="text-red-500 hover:text-red-700" aria-label="Cancelar sugestão"><FaTimes size={20} /></button>
                        </div>
                    )}
                </div>

                <div className="absolute top-0 sm:top-3.5 sm:right-5 right-5 z-[3000] pointer-events-none">
                    <div className="flex items-start gap-4 mt-5">
                        <button onClick={() => setIsListSidebarOpen(!isListSidebarOpen)} className="bg-white p-3 rounded-md shadow-lg pointer-events-auto text-blue-900 hover:bg-gray-100" aria-label="Mostrar lista de locais">
                            <FaBars size={23} />
                        </button>
                    </div>
                </div>

                <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} onAtualizado={handlePontoAtualizado} />
                {novaPosicao && <FormularioPonto coordenadas={novaPosicao} onClose={() => setNovaPosicao(null)} onCriado={fetchPontos} />}
                {suggestionCoords && <FormularioSugestao coordenadas={suggestionCoords} onClose={() => setSuggestionCoords(null)} onSuccess={() => { setSuggestionCoords(null); alert('Obrigado! Sua sugestão foi enviada para análise.'); }} />}
                
                <TideDayModal 
                    isOpen={isTideModalOpen}
                    onClose={() => setIsTideModalOpen(false)}
                    maresDoDia={maresDoDia}
                    local={mareData.local}
                />
            </div>
            <LocationListSidebar isOpen={isListSidebarOpen} pontos={pontos} onLocationClick={handleLocationSelect} />
            <BottomLeftLogo/>
            <MobileBottomBar/>
            <FloatingStarButton />
        </div>
    );
};

export default MapaInterativo;