export interface PontoTuristico {
  id: number;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  iconeUrl?: string;
  fotosOficiais?: string[];
  fotosUsuarios?: string[];
}