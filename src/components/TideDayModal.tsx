// src/components/TideDayModal.tsx
'use client';

import { FaTimes } from 'react-icons/fa';

interface Mare {
  hora: string;
  altura: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  maresDoDia: Mare[];
  local: string;
}

const TideDayModal = ({ isOpen, onClose, maresDoDia, local }: Props) => {
  if (!isOpen) return null;

  const diaAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

  return (
    <div className="fixed inset-0 bg-black/50 z-[5020] flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Tábua de Marés</h3>
            <p className="text-sm text-gray-500">{local} - {diaAtual}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 p-1.5 rounded-full hover:bg-gray-200">&times;</button>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {maresDoDia.map((mare, index) => {
              const isPreamar = mare.altura > 1.56; // Nível médio
              return (
                <li key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                  <span className={`font-bold ${isPreamar ? 'text-blue-600' : 'text-red-600'}`}>
                    {isPreamar ? 'Maré Alta' : 'Maré Baixa'}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{mare.altura.toFixed(2)}m</p>
                    <p className="text-sm text-gray-500">{mare.hora}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TideDayModal;