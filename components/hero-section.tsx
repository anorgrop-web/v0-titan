"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Check, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import KitSelectionModal from "./kit-selection-modal"

interface HeroSectionProps {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

export default function HeroSection({ isModalOpen, setIsModalOpen }: HeroSectionProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const mediaItems = [
    {
      type: "image",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/image%20813.png",
      alt: "Tábua de Corte de Titânio",
    },
    {
      type: "video",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/video%20p%C3%A1gina%201.mp4",
      alt: "Vídeo demonstrativo da Tábua de Corte de Titânio",
    },
    {
      type: "image",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/Group%201058.png",
      alt: "Tábua de Corte de Titânio",
    },
    {
      type: "video",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/video%20pg2.mp4",
      alt: "Segundo vídeo demonstrativo da Tábua de Corte de Titânio",
    },
    {
      type: "video",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/video%20pg3.mp4",
      alt: "Terceiro vídeo demonstrativo da Tábua de Corte de Titânio",
    },
    {
      type: "image",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/pg1edt.gif",
      alt: "Tábua de Corte de Titânio",
    },
    {
      type: "image",
      src: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/ChatGPT%20Image%2026%20de%20ago.%20de%202025%2C%2022_45_27.png",
      alt: "Tábua de Corte de Titânio",
    },
    {
      type: "image",
      src: "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s1/titanium-cutting-board-close-up.png",
      alt: "Tábua de Corte de Titânio",
    },
  ]

  const customerAvatars = [
    "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/download%20%281%29.jpg",
    "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/image_processing20220315-7853-ucio4g.jpeg",
    "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/images.jpg",
    "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/premium_photo-1664910471865-d2b3ac59a2e0.jpg",
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % mediaItems.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="bg-white py-8 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.7</span>
              <span className="text-sm text-gray-600">| Mais de 1000 avaliações verificadas</span>
            </div>

            {/* Product Image Carousel */}
            <div className="relative mb-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                {mediaItems[currentImage]?.type === "video" ? (
                  <video
                    src={mediaItems[currentImage].src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={mediaItems[currentImage]?.src || "/placeholder.svg"}
                    alt={mediaItems[currentImage]?.alt || "Tábua de Corte de Titânio"}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tábua De Corte 100% Titânio Puro: Chega De Microplásticos, Bactérias Ou Facas Cegas
            </h1>

            {/* Product Description */}
            <p className="text-gray-600 mb-6">
              Tábua de corte de titânio higiênica, durável e perfeitamente trabalhada
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Previne riscos de microplásticos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Resiste a bactérias e odores</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Mantém suas facas afiadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Elimina a contaminação cruzada de alimentos</span>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                {customerAvatars.map((avatar, i) => (
                  <Image
                    key={i}
                    src={avatar || "/placeholder.svg"}
                    alt={`Cliente satisfeito ${i + 1}`}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">Mais de 8 mil clientes satisfeitos</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Em estoque e pronto para envio</span>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleOpenModal}
              className="w-full bg-emerald-600 text-white py-4 text-lg font-bold rounded-xl mb-8 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              ESCOLHER MEU KIT
            </Button>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚪</span>
                </div>
                <p className="text-xs font-medium text-gray-700">TITÂNIO PURO</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🛡️</span>
                </div>
                <p className="text-xs font-medium text-gray-700">DURABILIDADE VITALÍCIA</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-xs font-medium text-gray-700">GARANTIA DE 90 DIAS</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🦠</span>
                </div>
                <p className="text-xs font-medium text-gray-700">ANTIBACTERIANO E LIVRE DE BPA</p>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left Column - Product Info */}
            <div>
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-medium">4.7</span>
                <span className="text-gray-600">| Mais de 1000 avaliações verificadas</span>
              </div>

              {/* Product Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Tábua De Corte 100% Titânio Puro: Chega De Microplásticos, Bactérias Ou Facas Cegas
              </h1>

              {/* Product Description */}
              <p className="text-xl text-gray-600 mb-8">
                Tábua de corte de titânio higiênica, durável e perfeitamente trabalhada
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">Previne riscos dos microplásticos</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">Anti bactérias e odores</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">Mantém suas facas afiadas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg text-gray-700">Elimina a contaminação cruzada de alimentos</span>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex -space-x-2">
                  {customerAvatars.map((avatar, i) => (
                    <Image
                      key={i}
                      src={avatar || "/placeholder.svg"}
                      alt={`Cliente satisfeito ${i + 1}`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-gray-600">Mais de 8 mil clientes satisfeitos</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium text-lg">Em estoque e pronto para envio</span>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleOpenModal}
                className="w-full bg-emerald-600 text-white py-6 text-xl font-bold rounded-xl mb-12 flex items-center justify-center gap-3"
              >
                <ShoppingCart className="h-6 w-6" />
                ESCOLHER MEU KIT
              </Button>

              {/* Feature Icons */}
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">⚪</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">TITÂNIO PURO</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">DURABILIDADE VITALÍCIA</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">💰</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">GARANTIA DE REEMBOLSO DE 90 DIAS</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🦠</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">ANTIBACTERIANO E LIVRE DE BPA</p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Images */}
            <div className="relative">
              {/* Main Product Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                {mediaItems[currentImage]?.type === "video" ? (
                  <video
                    src={mediaItems[currentImage].src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={mediaItems[currentImage]?.src || "/placeholder.svg"}
                    alt={mediaItems[currentImage]?.alt || "Tábua de Corte de Titânio"}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Carousel Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {mediaItems.slice(0, 4).map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      currentImage === index ? "ring-2 ring-black" : ""
                    }`}
                  >
                    {media.type === "video" ? (
                      <video src={media.src} muted className="w-full h-full object-cover" />
                    ) : (
                      <Image
                        src={media.src || "/placeholder.svg"}
                        alt={media.alt}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <KitSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
