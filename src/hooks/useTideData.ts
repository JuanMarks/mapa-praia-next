// src/hooks/useTideData.ts (Versão Corrigida e Final)
'use client';

import { useState, useEffect } from 'react';
import mareData from '../data/tabua-mares-2025.json';

interface Mare {
  hora: string;
  altura: number;
}

export interface TideInfo {
  status: 'Enchendo' | 'Vazante' | 'Desconhecido';
  proximaMare: {
    hora: string;
    altura: number;
    tipo: 'Alta' | 'Baixa';
  } | null;
  maresDoDia: Mare[];
}

// Helper para obter o próximo dia
const getProximoDia = (data: Date) => {
    const amanha = new Date(data);
    amanha.setDate(amanha.getDate() + 1);
    return amanha;
};


export const useTideData = () => {
  const [tideInfo, setTideInfo] = useState<TideInfo>({
    status: 'Desconhecido',
    proximaMare: null,
    maresDoDia: [],
  });

  useEffect(() => {
    const calcularMareAtual = () => {
      const agora = new Date();
      
      const obterDadosDoDia = (data: Date) => {
        const mes = data.toLocaleString('pt-BR', { month: 'long' }).toLowerCase() as keyof typeof mareData.dados;
        const dia = data.getDate();
        const dadosDoMes = mareData.dados[mes];
        if (!dadosDoMes) return null;
        return dadosDoMes.find(d => d.dia === dia) || null;
      };

      const dadosDeHoje = obterDadosDoDia(agora);
      if (!dadosDeHoje || dadosDeHoje.mares.length === 0) return;

      const maresDeHoje = [...dadosDeHoje.mares].sort((a, b) => a.hora.localeCompare(b.hora));
      let proximaMare: Mare | null = null;
      let mareAnterior: Mare | null = null;

      // Procura a próxima maré no dia de hoje
      for (const mare of maresDeHoje) {
        const [horas, minutos] = mare.hora.split(':').map(Number);
        const horarioMare = new Date();
        horarioMare.setHours(horas, minutos, 0, 0);

        if (horarioMare > agora) {
          proximaMare = mare;
          const indexProxima = maresDeHoje.findIndex(m => m.hora === proximaMare?.hora);
          mareAnterior = maresDeHoje[indexProxima - 1] || maresDeHoje[maresDeHoje.length - 1];
          break;
        }
      }

      // --- AQUI ESTÁ A CORREÇÃO ---
      // Se não encontrou próxima maré para hoje, procura a primeira de amanhã
      if (!proximaMare) {
        const amanha = getProximoDia(agora);
        const dadosDeAmanha = obterDadosDoDia(amanha);
        
        if (dadosDeAmanha && dadosDeAmanha.mares.length > 0) {
          // A próxima maré é a primeira de amanhã
          proximaMare = [...dadosDeAmanha.mares].sort((a, b) => a.hora.localeCompare(b.hora))[0];
          // A maré anterior é a última de hoje
          mareAnterior = maresDeHoje[maresDeHoje.length - 1];
        }
      }


      if (proximaMare && mareAnterior) {
        const status = proximaMare.altura > mareAnterior.altura ? 'Enchendo' : 'Vazante';
        // O nível médio do seu PDF é 1.56. Usamos isso para definir o tipo.
        const tipo = proximaMare.altura > 1.56 ? 'Alta' : 'Baixa'; 

        setTideInfo({
          status,
          proximaMare: { ...proximaMare, tipo },
          maresDoDia: maresDeHoje,
        });
      }
    };

    calcularMareAtual();
    const intervalId = setInterval(calcularMareAtual, 300000); // Atualiza a cada 5 minutos

    return () => clearInterval(intervalId);
  }, []);

  return tideInfo;
};