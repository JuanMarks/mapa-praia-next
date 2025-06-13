export interface PontoTuristico {
  id: number;
  nome: string;
  descricao: string;
  endereco?: object
  latitude: number;
  longitude: number;
  iconeUrl?: string;
  fotosOficiais?: string[];
  fotosUsuarios?: string[];
}