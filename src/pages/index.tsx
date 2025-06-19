import dynamic from 'next/dynamic';
import './globals.css';
import Header from '@/components/Header';

const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), { ssr: false });
const CarrosselHorizontal = dynamic(() => import ('@/components/CarrosselHorizontal'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5d784' }}>
      <Header />
      <MapaInterativo />
      <main className="p-4 bg-white">
        <CarrosselHorizontal />
      </main>
    </div>
  );
}
