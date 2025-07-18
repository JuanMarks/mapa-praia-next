// src/components/LocationListSidebar.tsx
'use client';

import { useEffect, useState } from "react";
import { PontoTuristico } from "@/types/ponto";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  pontos: PontoTuristico[];
  onLocationClick: (ponto: PontoTuristico | null) => void;
}

const LocationListSidebar = ({ isOpen, pontos, onLocationClick }: Props) => {
  const [showOverlay, setShowOverlay] = useState(false);
  // Adiciona estado para verificar se é mobile para decidir o posicionamento

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      
      setShowOverlay(isOpen && mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Overlay ESCURO acima do mapa, ativado apenas no mobile */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/20  z-[9998]"
          onClick={() => onLocationClick(null)} // Fecha ao clicar no fundo
        />
      )}

      {/* Sidebar original */}
      <div className={`
        absolute right-0 h-screen bg-white shadow-lg 
        transition-all duration-300 ease-in-out top-30 rounded
        ${isOpen ? 'translate-x-0 w-60 p-2' : '-translate-x-full w-0 p-0'} 
        overflow-hidden
        z-[9999] 
        // Adicione um top diferente para desktop se houver um header fixo, por exemplo
        // md:top-[algum_valor]
      `}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
          Todos os Locais
        </h2>
        <ul className="space-y-3 h-full overflow-y-auto">
          {pontos.map((ponto) => (
            <li 
              key={ponto.id} 
              onClick={() => onLocationClick(ponto)}
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                <Image 
                  src={ponto.photos && ponto.photos.length > 0 ? ponto.photos[0] : '/images/img1.jpeg'}
                  alt={ponto.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="56px"
                />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-700">{ponto.name}</h3>
                <p className="text-sm text-gray-500">{ponto.category?.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LocationListSidebar;