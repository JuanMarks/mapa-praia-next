import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore'; // Importe getDoc
import { auth, db } from '@/services/firebase'; // Importe db
import { useRouter } from 'next/router';

// Interface para o perfil do usuário no Firestore
export interface UserProfile {
  email: string;
  role: 'admin' | 'user';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // Estado para o perfil
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Usuário está logado, busca o perfil no Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
        setUser(currentUser);
      } else {
        // Usuário deslogou, limpa os estados
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email:any, password:any) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redireciona para a home após o login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Você pode adicionar um estado de erro aqui para mostrar na UI
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null); // Limpa o perfil no logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
};

  return {
    user,
    profile, // Retorne o perfil
    loading,
    login,
    logout,
  };
}