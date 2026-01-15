"use client"

import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface FixedConversionBarProps {
  isModalOpen: boolean
}

export default function FixedConversionBar({ isModalOpen }: FixedConversionBarProps) {
  const scrollToHero = () => {
    const heroSection = document.getElementById("hero")
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isModalOpen) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-3 sm:gap-4 max-w-4xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/Designsemnome_82_400x%20%281%29.webp"
              alt="Titanchef"
              className="w-10 h-10 object-cover rounded"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-semibold ml-1">4.7</span>
            </div>
            <div className="text-sm font-medium">Titanchef</div>
          </div>
        </div>

        <Button
          onClick={scrollToHero}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm whitespace-nowrap flex-shrink-0"
        >
          Ganhe 70% OFF!
        </Button>
      </div>
    </div>
  )
}
