"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacidadePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>

          <p>A Anor Commerce LLC respeita sua privacidade.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">1. Uso das Informações</h3>
          <p>Utilizamos seus dados (Nome, CPF, Endereço, Telefone) exclusivamente para:</p>
          <ul className="list-disc pl-5">
            <li>Processar o pagamento via gateway seguro.</li>
            <li>Emitir Nota Fiscal e etiquetas de envio.</li>
            <li>Enviar atualizações sobre o status do pedido.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-4">2. Segurança</h3>
          <p>
            Todas as transações são criptografadas (SSL/TLS). Não armazenamos números completos de cartão de crédito em
            nossos servidores.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">3. Contato</h3>
          <p>Para solicitar exclusão ou alteração de dados, contate: info@titanchefcut.com.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
