"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TrocasPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Trocas, Devoluções e Reembolso</h1>

          <p>
            A <strong>Titanchef</strong> preza pela qualidade de seus produtos de
            titânio e pela satisfação total de seus clientes.
          </p>
          {/* OCULTO TEMPORARIAMENTE - Anor Commerce LLC: (operada pela Anor Commerce LLC) */}

          <h3 className="text-xl font-bold text-gray-900 mt-4">1. Garantia de 90 Dias</h3>
          <p>
            Confiamos tanto na durabilidade do nosso produto que oferecemos uma garantia de 90 dias contra defeitos de
            fabricação ou problemas de qualidade.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">2. Direito de Arrependimento (7 Dias)</h3>
          <p>
            Conforme o Código de Defesa do Consumidor, você tem o direito de desistir da compra em até 7 (sete) dias
            corridos após o recebimento. O produto deve estar em sua embalagem original e sem indícios de uso.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">3. Procedimento de Devolução (Estoque no Brasil)</h3>
          <p>
            Possuímos um <strong>centro de logística reversa no Brasil</strong>. Isso facilita e agiliza o processo para
            você.
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Solicitação:</strong> Envie um e-mail para info@titanchefcut.com.
            </li>
            <li>
              <strong>Envio:</strong> Enviaremos instruções para envio ao nosso parceiro logístico nacional.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-4">4. Reembolsos</h3>
          <p>
            Após o recebimento e conferência do produto devolvido, o reembolso será processado em até 5 dias no mesmo
            método de pagamento original.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
