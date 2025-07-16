import PageAdmin from '@/components/PageAdmin'; // O componente da sua página
import withAuth from '../hooks/withAuth';   // Nosso HOC
// Envolvemos o componente da página com o HOC
const ProtectedAdminPage = withAuth(PageAdmin);

export default ProtectedAdminPage;