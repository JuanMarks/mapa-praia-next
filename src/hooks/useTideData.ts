// src/hooks/useTideData.ts

import { useState, useEffect } from 'react';
// Certifique-se que o caminho para o seu JSON está correto
import mareData from '../data/tabua-mares-2025.json';

type Mes = keyof typeof mareData.dados;

// Interface para descrever o que nosso hook vai retornar
export interface TideInfo {
  status: 'Enchendo' | 'Vazante' | 'Desconhecido';
  proximaMare: {
    hora: string;
    altura: number;
    tipo: 'Alta' | 'Baixa';
  } | null;
}

export const useTideData = () => {
  const [tideInfo, setTideInfo] = useState<TideInfo>({
    status: 'Desconhecido',
    proximaMare: null,
  });

  useEffect(() => {
    const calcularMareAtual = () => {
      const agora = new Date();
      const mesAtual = agora.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
      const diaAtual = agora.getDate();

      // Garante que o mês está no formato correto para a chave do objeto
      const mesesValidos: Mes[] = Object.keys(mareData.dados) as Mes[];
      const mesKey = mesesValidos.find(m => m.toLowerCase() === mesAtual);

      if (!mesKey) return;

      const dadosDoMes = mareData.dados[mesKey];
      if (!dadosDoMes) return;

      const dadosDoDia = dadosDoMes.find(d => d.dia === diaAtual);
      if (!dadosDoDia?.mares) return;

      const maresOrdenadas = [...dadosDoDia.mares].sort((a, b) => 
        a.hora.localeCompare(b.hora)
      );

      let proximaMare = null;
      // Encontra a primeira maré do dia que ainda não aconteceu
      for (const mare of maresOrdenadas) {
        const [horas, minutos] = mare.hora.split(':').map(Number);
        const horarioMare = new Date();
        horarioMare.setHours(horas, minutos, 0, 0);

        if (horarioMare > agora) {
          proximaMare = mare;
          break;
        }
      }

      if (proximaMare) {
        // Lógica para definir se está enchendo ou vazando
        const indexProxima = maresOrdenadas.findIndex(m => m.hora === proximaMare.hora);
        // Pega a maré anterior. Se a próxima for a primeira, a anterior é a última do array.
        const mareAnterior = maresOrdenadas[indexProxima - 1] || maresOrdenadas[maresOrdenadas.length - 1];
        
        const status = proximaMare.altura > mareAnterior.altura ? 'Enchendo' : 'Vazante';
        const tipo = proximaMare.altura > 1.56 ? 'Alta' : 'Baixa'; // Nível médio da tábua [cite: 1]

        setTideInfo({
          status,
          proximaMare: { ...proximaMare, tipo },
        });
      }
    };

    // Calcula a maré assim que o componente montar...
    calcularMareAtual();
    // ...e depois atualiza a cada 5 minutos.
    const intervalId = setInterval(calcularMareAtual, 300000); 

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return tideInfo;
};