// export interface PontoTuristico {
//   id: string;
//   nome: string;
//   descricao: string;
//   latitude: number;
//   longitude: number;
//   iconeUrl?: string;
//   fotosOficiais?: string[];
//   fotosUsuarios?: string[];
// }

export interface PontoTuristico {
  id: string;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  iconeUrl: string;
  imagemUrls?: string; // Adicione este campo opcional
  fotosUsuarios?: string[];
  criadoEm: any;
  // Outros campos que você possa ter
}