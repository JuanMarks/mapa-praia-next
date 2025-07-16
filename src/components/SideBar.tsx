'use client';

import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { FaMapMarkerAlt, FaShare, FaBookmark, FaRoute, FaTimes, FaInfoCircle, FaStar } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';
import '../pages/globals.css';
import Cookies from 'js-cookie';

interface SidebarProps {
  ponto: PontoTuristico | null;
  onClose: () => void;
  onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

const Sidebar = ({ ponto, onClose, onAtualizado }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagemCapa, setImagemCapa] = useState('/images/img1.jpeg');
  const { role } = useAuth();

  useEffect(() => {
    if (ponto) {
      setIsOpen(true);
      if (ponto.photos && ponto.photos.length > 0) {
        setImagemCapa(ponto.photos[0]);
      } else {
        setImagemCapa('/images/img1.jpeg');
      }
    } else {
      setIsOpen(false);
    }
  }, [ponto]);

  if (!ponto && !isOpen) return null;

  const temFotos = ponto?.photos && ponto.photos.length > 0;

  return (
    <>
      {ponto && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            absolute top-1/2
            bg-white p-2 shadow-md focus:outline-none z-[5001]
            transition-all duration-300 ease-in-out
            ${isOpen ? 'left-[397px] rounded-tr-2xl rounded-br-2xl' : 'left-0 rounded-r-full'}
          `}
          aria-label={isOpen ? "Esconder sidebar" : "Mostrar sidebar"}
        >
          {isOpen ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
        </button>
      )}

      <div
        className={`absolute top-15 left-2 h-140 rounded-2xl mt-9 ml-10 bg-white shadow-lg z-[5000] transition-transform duration-300 ease-in-out w-[350px]
                 ${isOpen ? 'translate-x-0' : '-translate-x-[400px]'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition z-20"
          aria-label="Fechar informações do local"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col h-full">
          <div className="relative w-full h-40">
            <Image
              src={imagemCapa}
              alt={`Foto de ${ponto?.name}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-2xl"
            />
          </div>

          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800">{ponto?.name}</h2>

            {/* Só renderiza se o ponto existir */}
            {ponto && (
              <StarRating
                ponto={ponto}
                isUserLoggedIn={!!role}
                onAtualizado={onAtualizado}
              />
            )}

            <div className="grid grid-cols-4 gap-2 my-4 text-center">
              <ActionButton icon={<FaRoute />} label="Rotas" />
              <ActionButton icon={<FaBookmark />} label="Salvar" />
              <ActionButton icon={<FaShare />} label="Partilhar" />
              <ActionButton icon={<FaMapMarkerAlt />} label="Mapa" />
            </div>

            <InfoItem icon={<FaInfoCircle />} text={ponto?.description || ''} />

            {temFotos && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Galeria</h3>
                <div className="grid grid-cols-3 gap-2">
                  {ponto?.photos?.map((fotoUrl, index) => (
                    <div key={index} className="relative w-full h-20 rounded-lg overflow-hidden">
                      <Image
                        src={fotoUrl}
                        alt={`Galeria de ${ponto?.name} ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
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

interface StarRatingProps {
  ponto: PontoTuristico;
  isUserLoggedIn: boolean;
  onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

const StarRating = ({ ponto, isUserLoggedIn, onAtualizado }: StarRatingProps) => {
  const [currentRating, setCurrentRating] = useState(ponto?.averageRating || 0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setCurrentRating(ponto?.averageRating || 0);
  }, [ponto?.averageRating]);

  if (!ponto) return null;

  const handleRatingSubmit = async (newRatingValue: number) => {
    if (!isUserLoggedIn) {
      alert("Você precisa estar logado para avaliar!");
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      return;
    }

    try {
      await api.post('/ratings', {
        value: newRatingValue,
        placeId: ponto.id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const response = await api.get('/places/getPlaces');
      const pontoAtualizado = response.data.find((p: PontoTuristico) => p.id === ponto.id);

      if (pontoAtualizado) {
        onAtualizado(pontoAtualizado);
      }

      alert("Obrigado pela sua avaliação!");
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      if (error.response?.status === 409) {
        alert("Você já avaliou este local.");
      } else {
        alert("Não foi possível registrar sua avaliação. Tente novamente.");
      }
    }
  };

  const stars = [...Array(5)].map((_, index) => {
    const ratingValue = index + 1;
    return (
      <label key={ratingValue}>
        <input
          type="radio"
          name="rating"
          value={ratingValue}
          onClick={() => handleRatingSubmit(ratingValue)}
          disabled={!isUserLoggedIn}
          className="sr-only"
        />
        <FaStar
          className="cursor-pointer transition-colors"
          color={ratingValue <= (hover || currentRating) ? "#ffc107" : "#e4e5e9"}
          size={24}
          onMouseEnter={() => isUserLoggedIn && setHover(ratingValue)}
          onMouseLeave={() => isUserLoggedIn && setHover(0)}
        />
      </label>
    );
  });

  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex">{stars}</div>
      <span className="text-gray-600 font-semibold">{currentRating.toFixed(1)}</span>
      {!isUserLoggedIn && <span className="text-xs text-gray-500">(Faça login para avaliar)</span>}
    </div>
  );
};

const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-800 transition">
    {icon}
    <span className="text-[10px] mt-1">{label}</span>
  </div>
);

const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-start mt-4">
    <div className="text-gray-500 mr-4 mt-1">{icon}</div>
    <p className="text-gray-700 text-sm">{text}</p>
  </div>
);

export default Sidebar;
