'use client';

import Image from 'next/image';


export default function BottomLeftLogo() {
  return (
    <>  
      {/* Logo fixa no canto inferior esquerdo */}
      <div className="fixed bottom-20 left-4 sm:hidden z-[1002]">
        <Image
          src="/images/logo_amoturOFC.png" // ajuste o caminho conforme seu projeto
          alt="Logo AMOTUR"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    </>
  );
}
