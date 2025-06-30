export interface PontoTuristico {
  id: number;
  name: string;
  description: string;
  address?: object
  latitude: number;
  longitude: number;
  iconURL?: string;
  type?: string;
  rating?: number;
  photos?: string[];
  
}