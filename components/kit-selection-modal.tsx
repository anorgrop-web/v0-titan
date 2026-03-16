"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface KitSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KitSelectionModal({ isOpen, onClose }: KitSelectionModalProps) {
  const [selectedKit, setSelectedKit] = useState(4) // Card 4 pré-selecionado

  const kits = [
    {
      id: 1,
      title: "Pequeno",
      dimensions: "25cm x 15cm",
      price: "R$59,90",
      link: "https://pagamento.titanchefcut.com/titanchefpequeno",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2010_50_13%20%282%29.png",
    },
    {
      id: 2,
      title: "Médio",
      dimensions: "30cm x 20cm",
      price: "R$69,90",
      link: "https://pagamento.titanchefcut.com/titanchefmedio",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_01_50%20%281%29.png",
    },
    {
      id: 3,
      title: "Grande",
      dimensions: "34cm x 24cm",
      price: "R$79,90",
      link: "https://pagamento.titanchefcut.com/titanchefgrande",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_04_04%20%282%29.png",
    },
    {
      id: 4,
      title: "Kit com 3 tamanhos",
      dimensions: "",
      price: "de R$299,67 POR R$89,87",
      discount: "70%OFF",
      link: "https://pagamento.titanchefcut.com/titanchef",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/Kit%20de%20T%C3%A1buas%20de%20Corte%20%282%29.png",
    },
  ]

  const handlePurchase = () => {
    const selectedKitData = kits.find((k) => k.id === selectedKit)
    if (selectedKitData?.link) {
      window.open(selectedKitData.link, "_blank")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <div className="flex-1 text-center px-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Escolha o kit de sua preferência</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Garanta uma, duas ou três tábuas TITANCHEF, em tamanhos diferentes.</p>
          </div>
          <button onClick={onClose} className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {kits.map((kit) => (
              <div key={kit.id} className="relative pt-2">
                {kit.id === 4 && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap">
                      Mais escolhido
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedKit(kit.id)}
                  className={`p-2 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md w-full h-full ${
                    selectedKit === kit.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={kit.image || "/placeholder.svg"}
                      alt={kit.title}
                      width={200}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm text-center leading-tight">{kit.title}</h3>
                  {kit.dimensions && (
                    <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-0.5">{kit.dimensions}</p>
                  )}
                  <div className="mt-1 sm:mt-2 text-center">
                    {kit.id === 4 ? (
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400 line-through">{kit.price.split(" POR ")[0]}</p>
                        <p className="text-sm sm:text-lg font-bold text-emerald-600">{kit.price.split(" POR ")[1]}</p>
                        <span className="inline-block bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold mt-0.5">
                          {kit.discount}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-lg font-bold text-emerald-600">{kit.price}</p>
                    )}
                  </div>
                  {selectedKit === kit.id && (
                    <div className="mt-1 sm:mt-2 flex justify-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-6 border-t flex-shrink-0 bg-white">
          <Button
            onClick={handlePurchase}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm sm:text-lg font-bold rounded-xl overflow-hidden"
          >
            <span className="truncate">
              Continuar com{" "}
              {selectedKit === 1 ? "Pequeno" : selectedKit === 2 ? "Médio" : selectedKit === 3 ? "Grande" : "Kit com 3"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
