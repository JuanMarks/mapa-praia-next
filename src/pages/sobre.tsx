'use client'

import InicioSobre from "@/components/SobreComponents/inicioSobre"
import NossoCompromisso from "@/components/SobreComponents/nossoCompromisso"
import QuemSomos from "@/components/SobreComponents/quemSomos"
import Header2 from "@/components/SobreComponents/Header2"
import Footer from "@/components/Footer"
import MobileBottomBar from "@/components/MobileBottomBar"

export default function Sobre() {
    return (
        <section>
            <Header2/>
            <InicioSobre/>
            <QuemSomos/>
            <NossoCompromisso/>
            <Footer/>
            <MobileBottomBar/>
        </section>
    )   
}