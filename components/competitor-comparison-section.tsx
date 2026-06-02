"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const scrollingTexts = [
  "Antibacteriano E Inodoro",
  "Garantia De Devolução Do Dinheiro Em 30 Dias",
  "Envio Rápido",
  "Devolução Em 30 Dias",
]

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
)

export default function CompetitorComparisonSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % scrollingTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const comparisonItems = [
    { feature: "Propriedades antibacterianas", katuchef: true, competitor: false },
    { feature: "Livre de BPA e toxinas", katuchef: true, competitor: false },
    { feature: "Pode ser lavado na máquina de lavar louça", katuchef: true, competitor: false },
    { feature: "Resistente a odores e manchas", katuchef: true, competitor: false },
    { feature: "Design amigável à faca", katuchef: true, competitor: true },
    { feature: "Durável para toda a vida", katuchef: true, competitor: false },
    { feature: "Dupla face", katuchef: true, competitor: true },
  ]

  return (
    <section className="w-full">
      {/* Scrolling Banner - identical to comparison section */}
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap">
          <div className="inline-block animate-[scroll_40s_linear_infinite]">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="text-sm font-medium px-16">
                {scrollingTexts.join("                    ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que as tábuas de corte de madeira e plástico são insuficientes
          </h2>
          <p className="text-lg text-gray-600 mb-6">Nenhum outro produto se compara</p>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Quando se trata de saúde, segurança e durabilidade, nenhuma tábua de corte se compara. Tábuas de madeira e
            plástico abrigam bactérias, liberam toxinas e se desgastam rapidamente – a Katuchef revoluciona o mercado
            com sua superfície estéril e resistente.
          </p>
        </div>

        {/* Comparison Section */}
        <div className="mb-16">
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-blue-900 italic">
                Comparando nosso produto com a<br />
                concorrência
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="/titanium-cutting-board-clean-modern.png"
                  alt="Tábua de corte de titânio Katuchef"
                  width={150}
                  height={120}
                  className="rounded-lg sm:w-[200px] sm:h-[150px]"
                />
              </div>

              <div className="bg-gray-100 rounded-lg p-4 sm:p-8 text-center w-32 h-24 sm:w-48 sm:h-32 flex flex-col items-center justify-center">
                <Image
                  src="/images/design-mode/Comparing-Our-Product_cutting.svg"
                  alt="Tábuas de corte tradicionais"
                  width={32}
                  height={32}
                  className="w-8 h-8 text-gray-600"
                />
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                  Tábuas de corte de
                  <br />
                  madeira ou plástico
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              {/* Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <span className="font-medium text-gray-900">Características</span>
              </div>
              <div className="bg-gray-50 p-4 border-b border-l border-gray-200 text-center">
                <span className="font-medium text-gray-900">Katuchef</span>
              </div>
              <div className="bg-gray-50 p-4 border-b border-l border-gray-200 text-center">
                <span className="font-medium text-gray-900">Concorrência</span>
              </div>

              {/* Comparison Items */}
              {comparisonItems.map((item, index) => (
                <div key={item.feature} className={`contents ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                  <div className={`p-4 border-b border-gray-200 ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="text-gray-700">{item.feature}</span>
                  </div>
                  <div
                    className={`p-4 border-b border-l border-gray-200 flex justify-center ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    {item.katuchef ? <CheckIcon /> : <XIcon />}
                  </div>
                  <div
                    className={`p-4 border-b border-l border-gray-200 flex justify-center ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    {item.competitor ? <CheckIcon /> : <XIcon />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
