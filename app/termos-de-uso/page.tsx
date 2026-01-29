"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermosPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-sm text-gray-700 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso e Política de Envio</h1>

          <p>
            Este site é operado pela <strong>Titanchef</strong>.
          </p>
          {/* OCULTO TEMPORARIAMENTE - Anor Commerce LLC: 
            Este site é operado pela <strong>Anor Commerce LLC</strong>, sediada em: 1209 Mountain Road Place Northeast,
            Albuquerque, New Mexico, 87110, USA.
          */}

          <h3 className="text-xl font-bold text-gray-900 mt-4">1. Política de Envio (Estoque Nacional)</h3>
          <p>
            Todos os produtos Titanchef são despachados diretamente do nosso <strong>estoque próprio no Brasil</strong>.
            Isso garante rapidez e isenção de taxas alfandegárias para o cliente final.
          </p>
          <p>
            <strong>Prazos Estimados de Entrega:</strong>
          </p>
          <ul className="list-disc pl-5">
            <li>Sudeste: 8 a 12 dias.</li>
            <li>Sul: 10 a 14 dias.</li>
            <li>Demais Regiões: 15 a 18 dias.</li>
          </ul>
          <p>O código de rastreamento será enviado ao seu e-mail assim que o pedido for postado.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">2. Suporte ao Cliente</h3>
          <p>Nosso atendimento funciona em horário comercial.</p>
          <ul className="list-disc pl-5">
            <li>E-mail: info@titanchefcut.com</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-4">3. Legislação Aplicável</h3>
          <p>
            Embora a operação logística seja local, estes Termos são regidos pelas leis do Estado do Novo México (EUA),
            respeitando-se as leis de proteção ao consumidor do território onde o serviço é prestado (Brasil).
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
