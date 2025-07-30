import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PontoTuristico } from '@/types/ponto'; // certifique-se que esse path está certo
import Footer from '@/components/Footer';

const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), { ssr: false });
const CarrosselHorizontal = dynamic(() => import('@/components/CarrosselHorizontal'), { ssr: false });

export default function Home() {
  const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);

  return (
    <div className="min-h-screen">
      <MapaInterativo pontoSelecionado={selectedPonto} /> {/* <-- Aqui você envia o ponto pro mapa */}

      <main id="favoritos">
        <CarrosselHorizontal onPontoClick={setSelectedPonto} /> {/* <-- Aqui você recebe o clique do carrossel */}
      </main>

      <Footer />
    </div>
  );
}
