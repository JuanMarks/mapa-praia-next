import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), { ssr: false });
const CarrosselHorizontal = dynamic(() => import ('@/components/CarrosselHorizontal'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      <MapaInterativo/>
      
      <main id='favoritos' className="p-4 bg-white">
          <CarrosselHorizontal/>
      </main>
        <Footer/>
    </div>
  );
}
