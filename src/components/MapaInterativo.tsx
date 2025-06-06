import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import PopupContent from './PopupContent';
import FormularioPonto from './FormularioPonto';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
// Corrige ícones do Leaflet em Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

const centro: [number, number] = [-3.069693, -39.672200];

const bounds: [[number, number], [number, number]] = [
    [-3.128981, -39.833362],
    [-2.965702, -39.527987]
];

const MapaInterativo = () => {
    const [pontos, setPontos] = useState<PontoTuristico[]>([]);
    const [novaPosicao, setNovaPosicao] = useState<[number, number] | null>(null);
    const { role, loading } = useAuth();

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setNovaPosicao([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    const fetchPontos = async () => {
        const res = await fetch('http://localhost:3000/pontos');
        const data = await res.json();
        console.log('Pontos carregados:', data);
        setPontos(data);
    };

    useEffect(() => {
        console.log(role)
        fetchPontos();
    }, []);

    return (
        <div className='m-3 sm:m-0'>
            <h1 className="text-center">Mapa Interativo de Pontos Turísticos</h1>
            <div id='map' className="rounded-lg overflow-hidden sm:container-fluid ">
            <MapContainer
                center={centro}
                zoom={14}
                minZoom={14}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                style={{ height: '80vh', width: '100%'}}
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapClickHandler />

                {/* Exibe o modal quando o mapa é clicado */}
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

                {pontos.map((ponto) => (
                    <Marker
                        key={ponto.id}
                        position={[ponto.latitude, ponto.longitude]}
                        icon={
                            ponto.iconeUrl
                                ? L.icon({
                                    iconUrl: ponto.iconeUrl || "https://cdn-icons-png.flaticon.com/512/854/854878.png",
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 32],
                                })
                                : undefined
                        }
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            },
                        }}
                    >
                        <Popup
                            closeButton={false}
                            autoClose={false}
                            closeOnClick={false}
                            autoPan={false}
                        >
                            <PopupContent ponto={ponto} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            </div>
        </div>

    );
};

export default MapaInterativo;
