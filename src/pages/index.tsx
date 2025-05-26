import dynamic from 'next/dynamic';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), {
  ssr: false
});

export default function Home() {
  return <MapaInterativo />;
}