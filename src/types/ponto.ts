// types/ponto.ts

export interface Address {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
}

export interface SocialLinks{
  tripadvisor?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  website?: string;
}

// Interface para o objeto Categoria aninhado
export interface Category {
  id: string;
  name: string;
}

interface AddressUpdatePayload {
  update: Address;
}

interface SocialLinksUpdatePayload {
  update: SocialLinks;
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
  category?: Category;
  socialLinks?: SocialLinks | SocialLinksUpdatePayload; // Permite tanto o objeto completo quanto a atualização
}