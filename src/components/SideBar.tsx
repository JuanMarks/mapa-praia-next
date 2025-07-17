// src/components/SideBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { PontoTuristico } from '@/types/ponto';
import { FaMapMarkerAlt, FaShare, FaBookmark, FaRoute, FaTimes, FaInfoCircle, FaStar } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import api from '@/axios/config';
import Cookies from 'js-cookie';
import { isAxiosError } from 'axios'; // Importa o type guard do Axios

interface SidebarProps {
  ponto: PontoTuristico | null;
  onClose: () => void;
  onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

const Sidebar = ({ ponto, onClose, onAtualizado }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagemCapa, setImagemCapa] = useState('/images/img1.jpeg');

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

      const handleRouteClick = () => {
        if (ponto) {
            // A URL base para direções no Google Maps
            const baseUrl = "https://www.google.com/maps/dir/?api=1";
            
            // Adiciona o destino usando as coordenadas do ponto
            const destination = `${ponto.latitude},${ponto.longitude}`;
            
            // O parâmetro 'destination' define o ponto final. 
            // O Google Maps usará a localização atual do dispositivo como origem por padrão.
            const mapsUrl = `${baseUrl}&destination=${destination}`;
            
            // Abre o Google Maps em uma nova aba
            window.open(mapsUrl, '_blank');
        }
    };

  const temFotos = ponto?.photos && ponto.photos.length > 0;

    return (
        <>
              {ponto && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`absolute top-1/2 bg-white p-2 shadow-md focus:outline-none z-[5001] transition-all duration-300 ease-in-out ${isOpen ? 'left-[350px] rounded-r-full' : 'left-0 rounded-r-full'}`}
                  aria-label={isOpen ? "Esconder sidebar" : "Mostrar sidebar"}
                >
                  {isOpen ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
                </button>
              )}

              <div
                className={`absolute top-0 left-0 h-full bg-white rounded-2xl shadow-lg z-[5000] transition-transform duration-300 ease-in-out w-[350px] ${isOpen ? 'transform-none' : '-translate-x-full'}`}
              >
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition z-20"
                  aria-label="Fechar informações do local"
                >
                  <FaTimes />
                </button>

                <div className="flex flex-col h-full">
                  <div className="relative w-full h-48">
                    <Image src={imagemCapa} alt={`Foto de ${ponto?.name}`} fill style={{ objectFit: 'cover' }} className="rounded-t-lg" />
                  </div>

                  <div className="p-4 flex-grow overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800">{ponto?.name}</h2>

                    {ponto && (
                      <StarRating
                        ponto={ponto}
                        onAtualizado={onAtualizado}
                      />
                    )}

                    <div className="grid grid-cols-4 gap-2 my-4 text-center">

                      <button onClick={handleRouteClick}><ActionButton icon={<FaRoute />} label="Rotas" /></button>
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
                              <Image src={fotoUrl} alt={`Galeria de ${ponto?.name} ${index + 1}`} fill style={{ objectFit: 'cover' }} className="hover:scale-110 transition-transform duration-200" />
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
    onAtualizado: (pontoAtualizado: PontoTuristico) => void;
}

            const StarRating = ({ponto, onAtualizado}: StarRatingProps) => {
    const {role} = useAuth();
            const [currentRating, setCurrentRating] = useState(ponto?.averageRating || 0);
            const [hover, setHover] = useState(0);
            const [error, setError] = useState<string | null>(null); // Estado para o erro
            const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para sucesso

    useEffect(() => {
              setCurrentRating(ponto?.averageRating || 0);
    }, [ponto?.averageRating]);

            if (!ponto) return null;

    const handleRatingSubmit = async (newRatingValue: number) => {
        if (!role) {
              setError("Você precisa estar logado para avaliar!");
            return;
        }
            setError(null); // Limpa erros anteriores

            const token = Cookies.get('token');
            if (!token) {
              setError("Sessão expirada. Por favor, faça login novamente.");
            return;
        }

            try {
              await api.post('/ratings', {
                value: newRatingValue,
                placeId: ponto.id,
              }, { headers: { 'Authorization': `Bearer ${token}` } });

            const response = await api.get('/places/getPlaces');
            const pontoAtualizado = response.data.find((p: PontoTuristico) => p.id === ponto.id);

            if (pontoAtualizado) {
              onAtualizado(pontoAtualizado);
            }

            setSuccessMessage("Obrigado pela sua avaliação!");
            setTimeout(() => setSuccessMessage(null), 3000); // Mensagem some após 3s

        } catch (err: unknown) { // CORRIGIDO
              console.error("Erro detalhado ao enviar avaliação:", err);
            let errorMessage = 'Não foi possível registrar sua avaliação.';
            if (isAxiosError(err) && err.response) {
                if (err.response.status === 409) { // Conflito, avaliação já existe
              errorMessage = "Você já avaliou este local.";
                } else {
              errorMessage = err.response.data?.message || 'Erro no servidor. Tente mais tarde.';
                }
            }
            setError(errorMessage);
        }
    };

    const stars = [...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
            return (
            <label key={ratingValue}>
              <input type="radio" name="rating" value={ratingValue} onClick={() => handleRatingSubmit(ratingValue)} disabled={!role} className="sr-only" />
              <FaStar
                className="cursor-pointer transition-colors"
                color={ratingValue <= (hover || currentRating) ? "#ffc107" : "#e4e5e9"}
                size={24}
                onMouseEnter={() => role && setHover(ratingValue)}
                onMouseLeave={() => role && setHover(0)}
              />
            </label>
            );
    });

            return (
            <div className="flex flex-col my-3">
              <div className="flex items-center gap-2">
                <div className="flex">{stars}</div>
                <span className="text-gray-600 font-semibold">{currentRating.toFixed(1)}</span>
              </div>
              {/* Mensagens de Feedback */}
              {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
              {successMessage && <span className="text-xs text-green-600 mt-1">{successMessage}</span>}
              {!role && <span className="text-xs text-gray-500 mt-1">(Faça login para avaliar)</span>}
            </div>
            );
};

            const ActionButton = ({icon, label}: {icon: React.ReactNode; label: string }) => (
            <div className="flex flex-col items-center cursor-pointer text-blue-600 hover:text-blue-800 transition">
              {icon}
              <span className="text-[10px] mt-1">{label}</span>
            </div>
            );

            const InfoItem = ({icon, text}: {icon: React.ReactNode; text: string }) => (
            <div className="flex items-start mt-4">
              <div className="text-gray-500 mr-4 mt-1">{icon}</div>
              <p className="text-gray-700 text-sm">{text}</p>
            </div>
            );

            export default Sidebar;