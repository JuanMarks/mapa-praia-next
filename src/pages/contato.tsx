'use client'

import ContatoPage from "@/components/ContatoComponents/ContatoPage"

import Header from "@/components/Header"
import './globals.css'
import Footer from "@/components/Footer"
import BannerContato from "@/components/ContatoComponents/BannerContato"


export default function Contato() {
    return (
        <section>
            <Header/>
            <BannerContato/>
            <ContatoPage/>
            <Footer/>
        </section>
    )
}