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
            Este site é operado pela <strong>Anor Commerce LLC</strong>, empresa registrada no estado do Novo México, EUA (EIN: 30-1462603), sob a marca comercial <strong>Titanchef</strong>.
          </p>

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

          <h3 className="text-xl font-bold text-gray-900 mt-4">3. Política de Reembolso e Trocas</h3>
          <ul className="list-disc pl-5">
            <li>Oferecemos garantia de reembolso integral de até 90 dias após a data de entrega do produto.</li>
            <li>Para solicitar reembolso ou troca, o cliente deve entrar em contato pelo e-mail info@titanchefcut.com informando o número do pedido e o motivo da solicitação.</li>
            <li>O reembolso será processado pelo mesmo método de pagamento utilizado na compra, em até 7 dias úteis após a aprovação da solicitação.</li>
            <li>Em caso de produto com defeito ou danificado no transporte, o cliente poderá optar entre reembolso integral ou envio de um novo produto sem custo adicional.</li>
            <li>Os custos de envio para devolução são por conta da empresa.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-4">4. Política de Privacidade</h3>
          <ul className="list-disc pl-5">
            <li>A Anor Commerce LLC coleta apenas os dados necessários para processamento e entrega do pedido: nome, endereço, e-mail, telefone e dados de pagamento.</li>
            <li>Os dados de pagamento são processados diretamente pelo nosso processador de pagamentos e não são armazenados em nossos servidores.</li>
            <li>Não compartilhamos dados pessoais com terceiros, exceto quando necessário para a entrega do pedido (transportadoras) ou por exigência legal.</li>
            <li>O cliente pode solicitar a exclusão de seus dados a qualquer momento pelo e-mail info@titanchefcut.com.</li>
            <li>Este site utiliza cookies para melhorar a experiência de navegação e para fins analíticos.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-4">5. Legislação Aplicável</h3>
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
