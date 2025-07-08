// src/components/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { FaMapMarkerAlt, FaShare, FaBookmark, FaRoute, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Image from 'next/image';
import '../pages/globals.css'; 

const API_BASE_URL = 'http://25.20.79.62:3000';

interface SidebarProps {
  ponto: PontoTuristico | null;
  onClose: () => void;
  onCriado:() => void;
}

const Sidebar = ({ ponto, onClose, onCriado }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [imagemCapa, setImagemCapa] = useState('/images/img1.jpeg'); // Imagem padrão inicial

  useEffect(() => {
    if (ponto?.photos && ponto.photos.length > 0) {
      // Seleciona uma imagem aleatória das fotos oficiais para ser a capa
      const randomIndex = Math.floor(Math.random() * ponto.photos.length);
      const fotoAleatoria = ponto.photos[randomIndex];
      setImagemCapa(`${fotoAleatoria}`);
    } else {
      // Usa uma imagem padrão se não houver fotos
      setImagemCapa('/images/img1.jpeg');
    }
  }, [ponto]); // Atualiza a imagem de capa sempre que o ponto mudar

  if (!ponto) {
    return null; // Não renderiza nada se nenhum ponto estiver selecionado
  }

  const temFotos = ponto.photos && ponto.photos.length > 0;

  return (
    <>
      {/* Botão para reabrir a sidebar se ela estiver fechada */}
      {/*----> botão de fechar arrumado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-1/2 left-2 z-[5001] bg-white p-2 rounded-r-full shadow-md focus:outline-none"
          aria-label="Mostrar sidebar"
        >
          <IoChevronForward size={20} />
        </button>
      )}

      {/* Container Principal da Sidebar */}
      <div
        className={`absolute top-0 left-0 h-[90vh] rounded-r-2xl mt-9 bg-white shadow-lg z-[5001] transition-all duration-300 ease-in-out w-[350px]
        ${isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}
      >
        {/* Botão para esconder/mostrar a sidebar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-1/2 -right-6 bg-white p-2 rounded-r-full shadow-lg focus:outline-none z-10"
          aria-label={isOpen ? 'Esconder sidebar' : 'Mostrar sidebar'}
        >
          <IoChevronBack size={20} />
        </button>

        <div className="flex flex-col h-full">
          {/* Imagem de Capa */}
          <div className="relative w-full h-48">
            <Image 
              src={imagemCapa} 
              alt={`Foto de ${ponto.name}`} 
              fill
              style={{ objectFit: 'cover' }}
              sizes="350px"
              priority
              className="rounded-t-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Botão de Fechar no topo */}
          <button onClick={onClose} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition">
            <FaTimes />
          </button>
          
          {/* Conteúdo */}
          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800">{ponto.name}</h2>

            {/* Botões de Ação */}
            <div className="grid grid-cols-4 gap-2 my-4 text-center">
                <ActionButton icon={<FaRoute />} label="Rotas" />
                <ActionButton icon={<FaBookmark />} label="Salvar" />
                <ActionButton icon={<FaShare />} label="Partilhar" />
                <ActionButton icon={<FaMapMarkerAlt />} label="Mapa" />
            </div>

            {/* Descrição do Ponto */}
            <InfoItem icon={<FaInfoCircle />} text={ponto.description} />

            {/* Galeria de Fotos */}
            {temFotos && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Galeria</h3>
                <div className="grid grid-cols-3 gap-2">
                  {ponto.photos?.map((fotoUrl, index) => (
                    <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                      <Image
                        src={`${fotoUrl}`}
                        alt={`Galeria de ${ponto.name} ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="100px"
                        className="hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Componentes auxiliares para os botões e itens de informação
const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-800 transition">
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-start mt-4">
    <div className="text-gray-500 mr-4 mt-1">{icon}</div>
    <p className="text-gray-700 text-sm">{text}</p>
  </div>
);

export default Sidebar;
