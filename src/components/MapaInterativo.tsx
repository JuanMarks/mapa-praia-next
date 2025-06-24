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
import { divIcon, icon } from 'leaflet';



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

  // Bloqueio de toque no mobile
  const [touchBloqueado, setTouchBloqueado] = useState(true);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const res = await fetch('http://25.20.79.62:3003/pontos');
    const data = await res.json();
    setPontos(data);
  };

  useEffect(() => {
    fetchPontos();
  }, []);

  const createCustomIcon = (iconeUrl: string) => {
    const isUrl = iconeUrl.startsWith('http') || iconeUrl.startsWith('/');

        if (isUrl) {
            // Se for uma URL, cria um ícone de imagem
            return icon({
            iconUrl: iconeUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
            });
        } else {
            // Se não for uma URL, cria um ícone de div com o emoji
            return divIcon({
            html: `<span style="font-size: 30px;">${iconeUrl}</span>`, // Emoji dentro de um span para controlar o tamanho
            className: 'emoji-icon', // Classe para remover o fundo branco padrão
            iconSize: [40, 40],
            iconAnchor: [15, 20], // Ancoragem ajustada para o centro inferior do emoji
            });
        }
    };
    if (isUrl) {
      return icon({
        iconUrl: iconeUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    } else {
      return divIcon({
        html: `<span style="font-size: 30px;">${iconeUrl}</span>`,
        className: 'emoji-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    }
  };

    return (
        
        <div className='sm:m-0'>
            
            <div id='map' className="rounded-lg overflow-hidden sm:container-fluid ">
            <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} />
            <MapContainer
                center={centro}
                zoom={14}
                minZoom={14}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                // tirar o zomm ao usar scrol do mouse
                scrollWheelZoom = {false}
                style={{ height: '100vh', width: '100%'}}
            >
                <TileLayer
  return (
    <div className="relative sm:m-0">
      {/* Camada para bloquear o toque no mobile */}
      {touchBloqueado && (
        <div
          className="absolute inset-0 z-[30] sm:hidden bg-transparent"
          onClick={liberarToqueTemporariamente}
        />
      )}

      <div id="map" className="rounded-lg overflow-hidden mt-8 mx-auto lg:px-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)]">
        <Sidebar ponto={selectedPonto} onClose={handleSidebarClose} />
        <MapContainer
          center={centro}
          zoom={13}
          minZoom={13}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={false}
          style={{ height: '100vh', width: '100% '}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler />

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

          {pontos?.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[ponto.latitude, ponto.longitude]}
              icon={createCustomIcon(ponto.iconeUrl ?? '📍')}
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
                className="text-2xl text-black"
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
