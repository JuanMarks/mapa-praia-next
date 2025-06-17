import Header from "./Header";
export default function PageAdmin() {
  return (
    <div className="min-h-screen bg-gray-100">
        <Header />
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo ao painel de administração!</h2>
        <p>Aqui você pode gerenciar os pontos turísticos, usuários e outras configurações do sistema.</p>
        {/* Adicione mais componentes ou funcionalidades conforme necessário */}
      </main>
    </div>
  );
}