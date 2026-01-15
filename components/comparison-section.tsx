"use client"

import { useState } from "react"
import Image from "next/image"

const scrollingTexts = ["Garantia De Devolução Do Dinheiro Em 90 Dias", "Antibacteriano E Inodoro", "Envio Rápido"]

const comparisons = [
  {
    id: "madeira",
    icon: (
      <Image
        src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/1_Wood_Bamboo%20%281%29.svg"
        alt="Wood/Bamboo icon"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    ),
    title: "Madeira/Bambu",
    image: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/madeira1.jpg",
    description:
      "Materiais naturais podem permitir o crescimento de bactérias e mofo em ranhuras e cortes, mesmo que invisíveis, o que pode contaminar seus alimentos com o tempo, causando mal-estar. Eles também absorvem odores e mancham facilmente.",
  },
  {
    id: "plastico",
    icon: (
      <Image
        src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/2_Plastic_Epicurean%20%281%29.svg"
        alt="Wood/Bamboo icon"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    ),
    title: "Plástico/polímeros",
    image: "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/section2plasticos.jpg",
    description:
      "Muitas tábuas de plástico contêm BPAs, ftalatos ou outros produtos químicos tóxicos que podem contaminar os alimentos durante o corte. Além disso, o plástico arranha facilmente, criando pequenas fissuras onde bactérias podem se acumular e proliferar.",
  },
  {
    id: "vidro",
    icon: (
      <Image
        src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/3_Glass_Stone_Steel%20%281%29.svg"
        alt="Wood/Bamboo icon"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    ),
    title: "Vidro/Pedra/Aço",
    image: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/vidro%2C%20pedra.jpg",
    description:
      "Embora esses materiais possam parecer higiênicos, sua extrema dureza danifica suas facas. Cada corte rapidamente deixa suas lâminas cegas, forçando você a afiá-las ou substituí-las com muito mais frequência – desperdiçando tempo, esforço e dinheiro.",
  },
]

export default function ComparisonSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % comparisons.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + comparisons.length) % comparisons.length)
  }

  return (
    <section className="w-full">
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap">
          <div className="inline-block animate-[scroll_40s_linear_infinite]">
            <span className="text-sm font-medium">
              {/* Primeira cópia */}
              {scrollingTexts.map((text, index) => (
                <span key={`copy1-${index}`} className="px-16">
                  {text}
                </span>
              ))}
              {/* Segunda cópia */}
              {scrollingTexts.map((text, index) => (
                <span key={`copy2-${index}`} className="px-16">
                  {text}
                </span>
              ))}
              {/* Terceira cópia */}
              {scrollingTexts.map((text, index) => (
                <span key={`copy3-${index}`} className="px-16">
                  {text}
                </span>
              ))}
              {/* Quarta cópia */}
              {scrollingTexts.map((text, index) => (
                <span key={`copy4-${index}`} className="px-16">
                  {text}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            A maioria das tábuas estão prejudicando sua saúde e suas facas
          </h2>

          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-4">
            Uma tábua de corte pode parecer uma ferramenta simples, mas o material errado pode ameaçar silenciosamente a
            segurança dos seus alimentos e destruir suas facas com o tempo.
          </p>

          <div className="w-20 h-1 bg-gray-400 mx-auto mb-12"></div>

          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {comparisons.map((comparison) => (
              <div key={comparison.id} className="bg-white rounded-lg overflow-hidden">
                <div className="aspect-square mb-6">
                  <img
                    src={comparison.image || "/placeholder.svg"}
                    alt={comparison.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-gray-700">{comparison.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{comparison.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{comparison.description}</p>
              </div>
            ))}
          </div>

          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {comparisons.map((comparison) => (
                  <div key={comparison.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                      <div className="aspect-square mb-6">
                        <img
                          src={comparison.image || "/placeholder.svg"}
                          alt={comparison.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="px-6 pb-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="text-gray-700">{comparison.icon}</div>
                          <h3 className="text-xl font-bold text-gray-900">{comparison.title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-base">{comparison.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center mt-6 gap-2">
              {comparisons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
