"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { KITS, KIT_ORDER } from "@/lib/pricing"
import { brl } from "@/lib/br-format"

interface KitSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KitSelectionModal({ isOpen, onClose }: KitSelectionModalProps) {
  const [selectedKit, setSelectedKit] = useState(4) // Card 4 pré-selecionado

  // Preços e kits vêm de lib/pricing.ts — a mesma fonte que o checkout usa para cobrar.
  const kits = KIT_ORDER.map((key, index) => {
    const kit = KITS[key]
    return {
      id: index + 1,
      key,
      title: kit.description,
      price: kit.compareAtCents ? `de ${brl(kit.compareAtCents)} POR ${brl(kit.cents)}` : brl(kit.cents),
      discount: kit.discountLabel,
      image: kit.image,
    }
  })

  const handlePurchase = () => {
    const selectedKitData = kits.find((k) => k.id === selectedKit)
    if (!selectedKitData) return
    // Leva as UTMs da LP junto para o checkout.
    const params = new URLSearchParams(window.location.search)
    params.set("kit", selectedKitData.key)
    window.location.href = `/checkout?${params.toString()}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Escolha o kit de sua preferência</h2>
            <p className="text-gray-600 mt-1">Garanta uma, duas ou três tábuas TITANUS CUT®, em tamanhos diferentes.</p>
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
