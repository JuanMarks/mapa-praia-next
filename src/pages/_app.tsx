// src/pages/_app.tsx

import './globals.css'; // Mova a importação do CSS global para cá
import type { AppProps } from 'next/app';
import 'leaflet/dist/leaflet.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;