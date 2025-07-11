// types/suggestion.ts
export interface Suggestion {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}