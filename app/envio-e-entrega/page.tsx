"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EnvioEntregaPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Envio e Entrega</h1>

          <p>
            A <strong>Titanchef</strong> (operada pela Anor Commerce LLC) trabalha para que você receba seu produto de
            forma rápida e segura.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">1. Prazo de Processamento</h3>
          <p>
            Após a confirmação do pagamento, seu pedido será processado em até <strong>2 dias úteis</strong>. Você
            receberá um e-mail com o código de rastreamento assim que o produto for despachado.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">2. Prazo de Entrega</h3>
          <p>O prazo de entrega varia de acordo com a sua localização:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Sudeste:</strong> 8 a 12 dias
            </li>
            <li>
              <strong>Sul:</strong> 10 a 14 dias
            </li>
            <li>
              <strong>Demais Regiões:</strong> 15 a 18 dias
            </li>
          </ul>
          <p className="text-sm text-gray-500">O código de rastreamento é enviado automaticamente após a postagem.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">3. Frete</h3>
          <p>
            Oferecemos <strong>frete grátis</strong> para todo o Brasil em todas as compras realizadas em nosso site.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">4. Rastreamento</h3>
          <p>
            Após o envio, você receberá um código de rastreamento por e-mail. Você pode acompanhar o status da sua
            entrega diretamente no site dos Correios ou da transportadora responsável.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">5. Endereço de Entrega</h3>
          <p>
            Certifique-se de que o endereço informado no momento da compra está correto e completo. A Titanchef não se
            responsabiliza por entregas em endereços incorretos ou incompletos fornecidos pelo cliente.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-4">6. Problemas na Entrega</h3>
          <p>
            Caso ocorra algum problema com a entrega (extravio, dano durante o transporte, etc.), entre em contato
            conosco:
          </p>
          <p>
            <strong>E-mail:</strong> info@titanchefcut.com
          </p>
          <p>Nossa equipe está pronta para resolver qualquer situação da melhor forma possível.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
