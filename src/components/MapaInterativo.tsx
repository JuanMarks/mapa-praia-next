'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { divIcon, icon } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import { PontoTuristico } from '@/types/ponto';
import PopupContent from './PopupContent';
import FormularioPonto from './FormularioPonto';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './SideBar';
import api from '@/axios/config';
import { AxiosError } from 'axios';
import RightSidebar from './RightSideBar';

// Corrige ícones do Leaflet em Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

const centro: [number, number] = [20.069693, -39.672200];

const bounds: [[number, number], [number, number]] = [
    [-3.128981, -39.833362],
    [-2.965702, -39.527987],
];

const MapaInterativo = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [novaPosicao, setNovaPosicao] = useState<[number, number] | null>(null);
    const { role, loading } = useAuth();
    const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);
    const [map, setMap] = useState<L.Map | null>(null);

    // Bloqueio de toque no mobile
    const [touchBloqueado, setTouchBloqueado] = useState(true);
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

       // --- CORREÇÃO APLICADA AQUI ---

    // 1. A função handleLocationSelect agora SÓ atualiza o estado.
    const handleLocationSelect = (ponto: PontoTuristico) => {
        console.log("Ponto selecionado:", ponto.name);
        setSelectedPonto(ponto);
    };

    // 2. Este useEffect reage à mudança de 'selectedPonto'.
    useEffect(() => {
        // Se não houver ponto selecionado ou o mapa não estiver pronto, não faz nada.
        if (!selectedPonto || !map) {
            return;
        }

        // Se ambos estiverem prontos, executa o flyTo.
        console.log("Mapa está pronto. Voando para o local...");
        map.flyTo([selectedPonto.latitude, selectedPonto.longitude], 17);

    }, [selectedPonto, map]); // Dependências: re-executa quando selectedPonto ou map mudam.


    const liberarToqueTemporariamente = () => {
        setTouchBloqueado(false);

        if (touchTimeoutRef.current) {
            clearTimeout(touchTimeoutRef.current);
        }

        touchTimeoutRef.current = setTimeout(() => {
            setTouchBloqueado(true);
        }, 10000);
    };

    const handleMarkerClick = (ponto: PontoTuristico) => {
        setSelectedPonto(ponto);
        if (map) {
            console.log('Marcador clicado:', ponto);
            map.flyTo([ponto.latitude, ponto.longitude], 15);
        }
    };

    const handleSidebarClose = () => {
        setSelectedPonto(null);
    };

    const MapClickHandler = () => {
        if (novaPosicao) return null;
        useMapEvents({
            click(e) {
                setNovaPosicao([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    const fetchPontos = async () => {
        try {
            const response = await api.get('/places/getPlaces');
            
            const pontosProcessados = response.data.map((ponto: any) => {
                
                // Cria uma cópia para evitar modificar o objeto original diretamente
                const pontoNormalizado = { ...ponto };

                // 2. Adiciona a data de criação fictícia (se não existir)
                pontoNormalizado.createdAt = ponto.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();

                // 3. Verifica se a propriedade 'address' existe e se dentro dela existe a chave 'update'
                //    O operador 'in' é a forma mais segura de fazer essa verificação.
                if (pontoNormalizado.address && 'update' in pontoNormalizado.address) {
                    // Substitui o objeto 'address' pelo conteúdo de 'update'
                    pontoNormalizado.address = pontoNormalizado.address.update;
                }
                
                return pontoNormalizado;
            });
            console.log('Pontos processados:', pontosProcessados);
            setPontos(pontosProcessados);
        } catch (error: any) {
            console.error('Erro ao buscar pontos:', error.message);
            // Aqui você pode exibir um toast ou setar um erro no estado
        }
    };

    useEffect(() => {
        fetchPontos();
    }, []);

    const createCustomIcon = (iconURL: string) => {
        const isUrl = iconURL.startsWith('http') || iconURL.startsWith('/');

        if (isUrl) {
            // Se for uma URL, cria um ícone de imagem
            return icon({
                iconUrl: iconURL,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            });
        } else {
            // Se não for uma URL, cria um ícone de div com o emoji
            return divIcon({
                html: `<span style="font-size: 30px;">${iconURL}</span>`, // Emoji dentro de um span para controlar o tamanho
                className: 'emoji-icon', // Classe para remover o fundo branco padrão
                iconSize: [40, 40],
                iconAnchor: [15, 30], // Ancoragem ajustada para o centro inferior do emoji
            });
        }
    };

    // const handleLocationSelect = (ponto: PontoTuristico) => {
        
    //     setSelectedPonto(ponto);
    //     if (map) {
    //         console.log('clicado')
    //         map.flyTo([ponto.latitude, ponto.longitude], 17);
    //     }
    // };


    return (
        <div className="relative sm:m-0">
            {/* Camada para bloquear o toque no mobile */}
            {touchBloqueado && (
                <div
                    className="absolute inset-0 z-[30] sm:hidden bg-transparent"
                    onClick={liberarToqueTemporariamente}
                />
            )}

            <div
                id="map"
                className="overflow-hidden mt-6 mx-auto px-0 sm:px-4 md:px-6 lg:px-8 shadow-2xl rounded-md sm:rounded-lg w-full max-w-[95vw] z-[30]"
            >
                <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} onCriado={() => setNovaPosicao(null)} />
                <MapContainer
                    center={centro}
                    zoom={13}
                    minZoom={13}
                    maxBounds={bounds}
                    maxBoundsViscosity={1.0}
                    scrollWheelZoom={false}
                    style={{
                        height: typeof window !== 'undefined' && window.innerWidth < 640 ? '80vh' : '100vh', width: '100%',
                    }}
                    whenReady={() => {
                        // Use leaflet's global L to get the map instance if needed, or use a ref
                        // If you want to keep the map instance, you can use a ref instead of whenReady
                    }}
                    ref={(mapInstance) => {
                        if (mapInstance) {
                            setMap(mapInstance);
                        }
                    }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapClickHandler />


                    {novaPosicao && (
                        role === 'admin' && (
                            <FormularioPonto
                                coordenadas={novaPosicao}
                                onClose={() => setNovaPosicao(null)}
                                onCriado={() => {
                                    setNovaPosicao(null);
                                    fetchPontos();
                                }}
                            />
                        ))}

                    {/* {novaPosicao && (
            <FormularioPonto
              coordenadas={novaPosicao}
              onClose={() => setNovaPosicao(null)}
              onCriado={() => {
                setNovaPosicao(null);
                fetchPontos();
              }}
            />
          )} */}



                    {pontos?.map((ponto) => (
                        <Marker
                            key={ponto.id}
                            position={[ponto.latitude, ponto.longitude]}
                            icon={createCustomIcon(ponto.iconURL ?? '📍')}
                            eventHandlers={{
                                click: () => handleMarkerClick(ponto),
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
            </div>
            <RightSidebar onLocationSelect={handleLocationSelect} />
        </div>
    );
};

export default MapaInterativo;
