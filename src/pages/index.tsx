import dynamic from 'next/dynamic';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header';
const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), {
  ssr: false
});

export default function Home() {
    return(
        <div className='bg-black-500 min-h-screen'>
            <Header />
            <MapaInterativo />;
        </div>
    );
}