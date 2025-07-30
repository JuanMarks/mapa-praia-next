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

      {/* Sidebar absoluta no canto, com transição e sumindo corretamente */}
      <div
        className={`
          absolute top-20 sm:right-5 right-3 sm:top-22 w-52 sm:w-60 h-[500px] bg-white shadow-lg z-[9999]
          flex flex-col transition-all duration-300 ease-in-out
          rounded-2xl
          ${isOpen ? 'opacity-100 visible pointer-events-auto p-2' : 'opacity-0 invisible pointer-events-none p-0'}
        `}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center flex-shrink-0">
          Todos os Locais
        </h2>

        <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent rounded-2xl">
          <ul className="space-y-3">
            {pontos.map((ponto) => (
              <li
                key={ponto.id}
                onClick={() => onLocationClick(ponto)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={ponto.photos?.[0] || '/images/img1.jpeg'}
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
