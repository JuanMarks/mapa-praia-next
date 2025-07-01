'use client'

import InicioSobre from "@/components/SobreComponents/inicioSobre"
import NossoCompromisso from "@/components/SobreComponents/nossoCompromisso"
import QuemSomos from "@/components/SobreComponents/quemSomos"
import Header from "@/components/Header"
import './globals.css'
import Footer from "@/components/Footer"

export default function Sobre() {
    return (
        <section>
            <Header/>
            <InicioSobre/>
            <QuemSomos/>
            <NossoCompromisso/>
            <Footer/>
        </section>
    )   
}