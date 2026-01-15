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
      title: "Tamanho pequeno 25cmx15cm",
      price: "R$59,90",
      link: "https://pagamento-seguro.titanchefcut.com/pequeno",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2010_50_13%20%282%29.png",
    },
    {
      id: 2,
      title: "Tamanho médio 30cmx20cm",
      price: "R$69,90",
      link: "https://pagamento-seguro.titanchefcut.com/medio",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_01_50%20%281%29.png",
    },
    {
      id: 3,
      title: "Tamanho grande 34cmx34cm",
      price: "R$79,90",
      link: "https://pagamento-seguro.titanchefcut.com/grande",
      image:
        "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/modal/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_04_04%20%282%29.png",
    },
    {
      id: 4,
      title: "Kit com 3 tamanhos",
      price: "de R$299,67 POR R$89,87",
      discount: "70%OFF",
      link: "https://pagamento-seguro.titanchefcut.com/",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Escolha o kit de sua preferência</h2>
            <p className="text-gray-600 mt-1">Garanta uma, duas ou três tábuas TITANCHEF, em tamanhos diferentes.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {kits.map((kit) => (
              <div key={kit.id} className="relative">
                {kit.id === 4 && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Mais escolhido
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedKit(kit.id)}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md w-full ${
                    selectedKit === kit.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src={kit.image || "/placeholder.svg"}
                      alt={kit.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm text-center">{kit.title}</h3>
                  <div className="mt-2 text-center">
                    {kit.id === 4 ? (
                      <div>
                        <p className="text-xs text-gray-500 line-through">{kit.price.split(" POR ")[0]}</p>
                        <p className="text-lg font-bold text-emerald-600">{kit.price.split(" POR ")[1]}</p>
                        <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {kit.discount}
                        </span>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-emerald-600">{kit.price}</p>
                    )}
                  </div>
                  {selectedKit === kit.id && (
                    <div className="mt-2 flex justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button
            onClick={handlePurchase}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-bold rounded-xl"
          >
            Continuar com {kits.find((k) => k.id === selectedKit)?.title}
          </Button>
        </div>
      </div>
    </div>
  )
}
