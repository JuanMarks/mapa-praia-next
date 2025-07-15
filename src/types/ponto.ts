// types/ponto.ts

export interface Address {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
}

// Interface para o objeto Categoria aninhado
export interface Category {
  id: string;
  name: string;
}

interface AddressUpdatePayload {
  update: Address;
}

export interface PontoTuristico {
  id: string; // ID deve ser string, como no Prisma
  name: string;
  description: string;
  address?: Address | AddressUpdatePayload; 
  latitude: number;
  longitude: number;
  iconURL?: string;
  photos?: string[];
  createdAt?: string;
  categoryId?: string;
  averageRating?: number; 
  
  // --- CORREÇÃO AQUI ---
  // A categoria agora é um objeto que pode ser opcional
  category?: Category;
}