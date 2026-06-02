"use client"

import { ShoppingBag, Menu, Truck, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-sm font-medium">OFERTA ESPECIAL POR TEMPO LIMITADO | ATÉ 70% DE DESCONTO</p>
      </div>

      {/* Benefits Bar - Desktop */}
      <div className="hidden lg:block bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">br</span>
              <span>A TÁBUA DE CORTE DE TITÂNIO NÚMERO 1 DO BRASIL </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚚</span>
              <span>ENVIO RÁPIDO</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💰</span>
              <span>GARANTIA DE 90 DIAS </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar - Mobile Scrolling */}
      <div className="lg:hidden bg-gray-100 py-2 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          <div className="flex items-center space-x-8 text-sm text-gray-700 px-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span className="font-medium">ENVIO RÁPIDO</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">GARANTIA DE 90 DIAS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">ENTREGA EXPRESSA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">🇺🇸</span>
              <span className="font-medium">PRODUTO AMERICANO</span>
            </div>
            {/* Duplicate content for seamless loop */}
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span className="font-medium">ENVIO RÁPIDO</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">GARANTIA DE 90 DIAS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">ENTREGA EXPRESSA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">🇺🇸</span>
              <span className="font-medium">PRODUTO AMERICANO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-black">KATU</span>
                <span className="text-red-600">CHEF</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("caracteristicas")}
                className="text-gray-700 hover:text-black font-medium"
              >
                CARACTERÍSTICAS
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-gray-700 hover:text-black font-medium"
              >
                COMO FUNCIONA
              </button>
              <button
                onClick={() => scrollToSection("avaliacoes")}
                className="text-gray-700 hover:text-black font-medium"
              >
                AVALIAÇÕES
              </button>
              <button onClick={() => scrollToSection("faq")} className="text-gray-700 hover:text-black font-medium">
                PERGUNTAS FREQUENTES
              </button>
              <button onClick={() => scrollToSection("contato")} className="text-gray-700 hover:text-black font-medium">
                CONTATO
              </button>
            </nav>

            {/* Cart and Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CSS Animation for Horizontal Scrolling */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </>
  )
}
