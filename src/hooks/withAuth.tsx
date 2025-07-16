// src/components/withAuth.tsx
import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth'; // Certifique-se que o caminho está correto

// 1. Tipagem correta para o HOC
// Ele aceita um componente com quaisquer props (P) e retorna um novo componente com essas mesmas props.
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  
  const AuthComponent = (props: P) => {
    const { role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Se o carregamento terminou e o usuário não tem a role de 'admin'
      if (!loading && role !== 'admin') {
        // Redireciona para a página de login.
        // `router.replace` é melhor que `push` aqui, pois não adiciona a página de admin ao histórico do navegador.
        router.replace('/login');
      }
    }, [role, loading, router]);

    // 2. Lógica de renderização corrigida
    // Enquanto estiver carregando, mostra uma tela de loading.
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-lg font-semibold text-gray-600">Verificando permissões...</p>
        </div>
      );
    }
    
    // Se o carregamento terminou e o usuário é admin, renderiza a página protegida.
    if (role === 'admin') {
      return <WrappedComponent {...props} />;
    }

    // 3. Se não for admin, não renderiza nada (null) enquanto o redirecionamento acontece.
    // Isso evita que a tela "Carregando..." fique presa para usuários normais.
    return null;
  };

  // Define um nome de exibição para facilitar a depuração no React DevTools
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;