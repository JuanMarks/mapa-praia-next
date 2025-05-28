// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    console.log('Token:', token);
    console.log('Role:', role);
    if (token && role) {
      setRole(role);
    }

    setLoading(false);
  }, []);

  return { role, loading };
}
