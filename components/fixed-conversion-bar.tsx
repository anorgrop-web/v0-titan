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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-3 sm:p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-3 max-w-4xl">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <img
              src="/images/design-mode/Designsemnome_82_400x.webp"
              alt="Titanus Cut®"
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-semibold ml-1">4.7</span>
            </div>
            <div className="text-sm font-medium">Titanus Cut®</div>
          </div>
        </div>

        <Button
          onClick={scrollToHero}
          className="h-auto shrink-0 whitespace-normal bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold leading-tight text-center px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg max-w-[50%] sm:max-w-none"
        >
          GANHE 70% DE DESCONTO!
        </Button>
      </div>
    </div>
  )
}
