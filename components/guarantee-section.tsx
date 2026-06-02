import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function GuaranteeSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Money Back Guarantee Badge */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center border-4 border-gray-800">
              <div className="text-white text-xs font-bold text-center leading-tight">
                <div>100%</div>
                <div className="text-[10px]">GARANTIA</div>
                <div className="text-[10px]">90 DIAS</div>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-400 animate-spin-slow"></div>
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Compare com confiança - é 100% sem riscos!
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Se você não estiver satisfeito com o produto, oferecemos uma política de devolução de dinheiro em até 90 dias. Envie seu pacote de volta e receba um reembolso total, sem perguntas.
        </p>

        {/* Product Image with Dashed Border */}
        <div className="relative mb-12">
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 bg-white">
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/titanium-cutting-board-with-vegetables.png"
                alt="Tábua de corte de titânio com tomates e salsa"
                width={400}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* USA Flag and Text */}
            <div className="flex items-center justify-center gap-2 mt-6 mb-4">
              <span className="text-2xl">BR</span>
              <span className="font-semibold text-gray-800">Tábua de corte de titânio nº 1 do BRASIL</span>
            </div>

            {/* Discount Heading */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ATÉ 70% DE DESCONTO POR TEMPO LIMITADO!
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-blue-400 h-3 rounded-full w-3/4"></div>
            </div>

            {/* Limited Time Text */}
            <p className="text-gray-600 mb-6">
              Esta oferta por tempo limitado está em alta demanda, e o estoque continua esgotando.
            </p>

            {/* Customer Avatars and Rating */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                <span className="text-sm text-gray-600 ml-1">4.5</span>
              </div>
            </div>

            {/* In Stock Badge */}
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-6">
              ✅ Em estoque e pronto para envio
            </Badge>

            {/* Main CTA Button */}
            <Button className="w-full max-w-md bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg text-lg mb-4">
              GANHE 70% DE DESCONTO AGORA!
            </Button>

            {/* Guarantee Text */}
            <p className="text-sm text-gray-600">
              Experimente hoje mesmo com uma
              <br />
              garantia de reembolso de 90 dias!
            </p>
          </div>
        </div>

        {/* Help Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-6 py-3 shadow-lg">
            ❓ Ajuda
          </Button>
        </div>
      </div>
    </section>
  )
}
