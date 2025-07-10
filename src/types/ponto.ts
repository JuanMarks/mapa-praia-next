export interface Address {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
}


export interface PontoTuristico {
  id: number;
  name: string;
  description: string;
  address?: Address
  latitude: number;
  longitude: number;
  iconURL?: string;
  type?: string;
  rating?: number;
  photos?: string[];
  createdAt?: string;
  categoryId?: string;
  averageRating?: number; 
}