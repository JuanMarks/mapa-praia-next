import dynamic from 'next/dynamic';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';

const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), { ssr: false });
const CarrosselHorizontal = dynamic(() => import ('@/components/CarrosselHorizontal'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroBanner/>
      <MapaInterativo />
      <main className="p-4 bg-white">
        <CarrosselHorizontal />
      </main>
        <Footer/>
    </div>
  );
}
