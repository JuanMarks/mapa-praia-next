// src/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import { PontoTuristico } from '@/types/ponto'; // Certifique-se que o tipo está correto
import { FaMapMarkerAlt, FaPhone, FaShare, FaBookmark, FaRoute, FaTimes } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import image1 from '../../public/images/3704180118_2bfb6685b3_c.jpg';

interface SidebarProps {
  ponto: PontoTuristico | null;
  onClose: () => void;
}

const Sidebar = ({ ponto, onClose }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!ponto) {
    return null; // Não renderiza nada se nenhum ponto estiver selecionado
  }

  // Pega a primeira imagem para exibir como capa, ou uma imagem padrão
  const imagemCapa = image1.src

  return (
    <>
      {/* Overlay escuro para o fundo (opcional, melhora o foco na sidebar) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-25 z-10 transition-opacity ${ponto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Container Principal da Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-[5000] transition-transform duration-300 ease-in-out w-[350px]
                   ${isOpen ? 'transform-none' : '-translate-x-full'}`}
      >
        {/* Botão para esconder/mostrar a sidebar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -right-6 bg-white p-2 rounded-r-full shadow-lg focus:outline-none z-30"
          aria-label={isOpen ? 'Esconder sidebar' : 'Mostrar sidebar'}
        >
          {isOpen ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
        </button>

        <div className="flex flex-col h-full">
          {/* Imagem de Capa */}
          <img src={imagemCapa} alt={`Foto de ${ponto.nome}`} className="w-full h-48 object-cover" />

          {/* Botão de Fechar no topo */}
          <button onClick={onClose} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5">
            <FaTimes />
          </button>
          
          {/* Conteúdo de Texto */}
          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800">{ponto.nome}</h2>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm text-gray-600 ml-2">(5.0)</span>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-4 gap-2 my-4 text-center">
                <ActionButton icon={<FaRoute />} label="Rotas" />
                <ActionButton icon={<FaBookmark />} label="Salvar" />
                <ActionButton icon={<FaShare />} label="Partilhar" />
                <ActionButton icon={<FaPhone />} label="Ligar" />
            </div>

            {/* Detalhes do Ponto */}
            <ul className="space-y-3 text-gray-700">
              <InfoItem icon={<FaMapMarkerAlt />} text="R. Martins Teixeira, 1315 - Amontada, CE" />
              <InfoItem icon={<FaPhone />} text="(54) 98117-1725" />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

// Componentes auxiliares para os botões e itens de informação
const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-800">
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-center">
    <div className="text-gray-500 mr-4">{icon}</div>
    <span>{text}</span>
  </li>
);

export default Sidebar;