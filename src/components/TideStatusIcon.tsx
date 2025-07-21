// src/components/TideStatusIcon.tsx (Versão final com imagem)
'use client';

import { Marker, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useTideData } from '@/hooks/useTideData';
import { renderToString } from 'react-dom/server';
import Image from 'next/image';

interface Props {
  position: [number, number];
  onClick: () => void;
  pane: string;
}

// Componente React que define a aparência do ícone
const IconeDeMareComImagem = ({ status }: { status: 'Enchendo' | 'Vazante' }) => {
  const isEnchendo = status === 'Enchendo';
  const arrowColor = isEnchendo ? '#3b82f6' : '#ef4444'; // Azul ou Vermelho

  return (
    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
      {/* Usamos a tag <img> padrão para compatibilidade máxima com renderToString */}
      <Image src="/images/wave.png" alt="Ícone de maré" width={100} height={100} />
      <div style={{
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'white',
        padding: '4px',
        borderRadius: '9999px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isEnchendo ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={arrowColor}><path d="M12 4l-8 8h6v8h4v-8h6l-8-8z"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={arrowColor}><path d="M12 20l8-8h-6V4h-4v8H4l8 8z"/></svg>
        )}
      </div>
    </div>
  );
};

const TideStatusIcon = ({ position, onClick, pane }: Props) => {
  const { status } = useTideData();

  // Esta guarda de segurança agora funcionará corretamente
  if (status === 'Desconhecido') {
    return null;
  }

  // Converte nosso componente JSX em uma string HTML pura e confiável
  const iconHtml = renderToString(<IconeDeMareComImagem status={status} />);

  const customIcon = divIcon({
    html: iconHtml,
    className: 'leaflet-custom-tide-icon', // Classe para remover o fundo padrão
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Centraliza o ícone
  });

  return (
    <Marker 
      position={position} 
      icon={customIcon} 
      eventHandlers={{ click: onClick }}
      pane={pane}
    >
      <Tooltip>Clique para ver os detalhes da maré de hoje</Tooltip>
    </Marker>
  );
};

export default TideStatusIcon;