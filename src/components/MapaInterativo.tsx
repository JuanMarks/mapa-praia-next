import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import PopupContent from './PopupContent';
import FormularioPonto from './FormularioPonto';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import Sidebar from './SideBar';
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
    const { user, profile, loading } = useAuth();
    const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);

    const handleMarkerClick = (ponto: PontoTuristico) => {
        setSelectedPonto(ponto);
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
        const querySnapshot = await getDocs(collection(db, "pontos")); // "pontos" é um exemplo de coleção
        const pointsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Pontos carregados do Firebase:", pointsData);
        setPontos(pointsData as PontoTuristico[]); // Certifique-se de que os dados estão no formato correto
        // Aqui você pode usar os dados para popular seu mapa, por exemplo.
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };

    useEffect(() => {
        console.log(profile?.role)
        fetchPontos();
    }, []);

    return (
        <div className=' sm:m-0'>
            {/* <h1 className="text-center">Mapa Interativo de Pontos Turísticos</h1> */}
            <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} />
            <div id='map' className="rounded-lg overflow-hidden sm:container-fluid ">
            <MapContainer
                center={centro}
                zoom={14}
                minZoom={14}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                style={{ height: '100vh', width: '100%'}}
                className='map-container'
            >
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                <MapClickHandler />

                {/* Exibe o modal quando o mapa é clicado */}
                {novaPosicao && (
                <FormularioPonto
                    show={!!novaPosicao}
                    coordenadas={novaPosicao}
                    onClose={() => setNovaPosicao(null)}
                    onCriado={() => {
                    setNovaPosicao(null);
                    fetchPontos();
                    }}
                />
                )}

                // Dentro do seu componente MapaInterativo.tsx

                {pontos.map((ponto) => (
                    <Marker
                        key={ponto.id}
                        position={[ponto.latitude, ponto.longitude]}
                        icon={
                        // Verificamos se existe um iconeUrl (nosso emoji)
                        ponto.iconeUrl
                            // Se existir, usamos L.divIcon
                            ? L.divIcon({
                                html: ponto.iconeUrl,      // 👈 AQUI passamos o emoji como HTML
                                className: 'emoji-icon',  // 👈 Uma classe CSS para estilizar e remover o fundo branco padrão
                                iconSize: [40, 40],       // Tamanho do ícone
                                iconAnchor: [15, 30],     // Ponto de "ancoragem" do ícone no mapa
                            })
                            // Se não existir, ele usará o ícone padrão do Leaflet que já corrigimos
                            : undefined 
                        }
                        eventHandlers={{
                            click: () => handleMarkerClick(ponto),
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            },
                        }}
                    >
                        <Popup>
                        <PopupContent ponto={ponto} />
                        </Popup>
                        <Tooltip
                            permanent // <-- A propriedade mais importante! Faz o texto ficar sempre visível.
                            direction="bottom" // Posição do texto: 'top', 'bottom', 'left', 'right'
                            offset={[0, 10]} // Ajusta a posição (horizontal, vertical) em pixels
                            opacity={1}
                            className="text-2xl text-black" // Classe CSS para estilização personalizada
                        >
                            {ponto.nome}
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
            </div>
        </div>

    );
};

export default MapaInterativo;
