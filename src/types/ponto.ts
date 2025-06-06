export interface PontoTuristico {
  id: string;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  iconeUrl?: string;
  fotosOficiais?: string[];
  fotosUsuarios?: string[];
}