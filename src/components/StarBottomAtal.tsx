'use client';

import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

export default function FloatingStarButton() {
  return (
    <div className="fixed bottom-34 sm:bottom-20 right-4 z-[1002]">
      <Link
        href="#favoritos"
        className="bg-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
        aria-label="Carrosel de melhores avaliados"
      >
        <FaStar size={20} className="text-blue-500" />
      </Link>
    </div>
  );
}
