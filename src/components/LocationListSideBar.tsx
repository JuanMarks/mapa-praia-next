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
      {/* Overlay escuro no mobile */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/20 z-[9998]"
          onClick={() => onLocationClick(null)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed rounded-2xl sm:top-25 top-20 w-60 h-[500px] bg-white shadow-lg
        transition-all duration-300 ease-in-out z-[9998]
        flex flex-col
        ${isOpen ? 'right-5 translate-x-0 opacity-100 visible p-2' : 'right-0 translate-x-full opacity-0 invisible p-0'}
      `}>
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center flex-shrink-0">
          Todos os Locais
        </h2>

        <div className="overflow-y-auto flex-1 pr-2">
          <ul className="space-y-3">
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
      </div>
    </>
  );
};

export default LocationListSidebar;
