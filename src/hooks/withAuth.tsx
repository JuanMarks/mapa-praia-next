import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const { role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && role !== 'admin') {
        // Se não estiver carregando e o usuário não for admin,
        // redireciona para a página de login.
        router.replace('/login');
      }
    }, [role, loading, router]);

    // Se estiver carregando ou se for admin, mostra o conteúdo da página
    if (loading || role !== 'admin') {
      // Pode mostrar um spinner de carregamento aqui enquanto verifica a autenticação
      return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    // Se passou na verificação, renderiza o componente da página de admin
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;