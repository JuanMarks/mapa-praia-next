import PageAdmin from '@/components/PageAdmin';
import withAuth from '@/hooks/withAuth';
import "./globals.css";

// Envolvemos o PageAdmin com o withAuth.
// Agora, esta página só será renderizada se o usuário for um admin.
const AdminPage = () => {
  return <PageAdmin />;
};

export default withAuth(AdminPage);