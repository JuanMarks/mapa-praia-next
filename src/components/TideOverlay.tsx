// src/components/TideOverlay.tsx

import { useTideData } from '@/hooks/useTideData';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Ícones para indicar a maré

const TideOverlay = () => {
  const { status, proximaMare } = useTideData();

  if (!proximaMare) {
    return null; // Não mostra nada se não conseguir calcular a maré
  }

  const isEnchendo = status === 'Enchendo';

  return (
    // O z-index garante que ele fique sobre o mapa
    <div className="absolute bottom-20 left-2  bg-white bg-opacity-80 p-3 rounded-lg shadow-lg z-[1000]">
      <div className="flex items-center">
        {isEnchendo ? (
          <FaArrowUp className="text-blue-500 mr-2" />
        ) : (
          <FaArrowDown className="text-red-500 mr-2" />
        )}
        <div>
          <p className="font-bold text-gray-800">Maré {status}</p>
          <p className="text-sm text-gray-600">
            Próxima maré {proximaMare.tipo.toLowerCase()} às <strong>{proximaMare.hora}</strong> ({proximaMare.altura.toFixed(2)}m)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TideOverlay;