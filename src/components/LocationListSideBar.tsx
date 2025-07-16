// src/components/LocationListSidebar.tsx
'use client';

import { PontoTuristico } from "@/types/ponto";
import Image from "next/image";

interface Props {
    isOpen: boolean;
    pontos: PontoTuristico[];
    onLocationClick: (ponto: PontoTuristico) => void;
}

const LocationListSidebar = ({ isOpen, pontos, onLocationClick }: Props) => {
    return (
        // A largura e a transição são controladas pela prop 'isOpen'
        <div className={`
            flex-shrink-0 bg-white shadow-lg transition-all duration-300 ease-in-out
            ${isOpen ? 'w-80 p-4' : 'w-0 p-0'} 
            overflow-hidden z-[1003]
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
    );
};

export default LocationListSidebar;