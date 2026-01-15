"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContatoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-gray-900 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Contato</h1>

        <p className="text-gray-700 mb-8">
          Entre em contato conosco através dos canais abaixo. Nossa equipe está pronta para ajudá-lo com dúvidas sobre
          produtos, pedidos, entregas e muito mais.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-6 h-6 text-red-500 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">E-mail</h2>
              <a href="mailto:info@titanchefcut.com" className="text-red-500 hover:underline">
                info@titanchefcut.com
              </a>
              <p className="text-gray-500 text-sm mt-1">Responderemos em até 24 horas úteis.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-6 h-6 text-red-500 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Horário de Atendimento</h2>
              <p className="text-gray-700">Segunda a Sexta: 9:00 às 18:00</p>
              <p className="text-gray-500 text-sm mt-1">Horário de Brasília (GMT-3)</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            <strong>Titanchef</strong> é uma marca operada por Anor Commerce LLC.
            <br />
            Endereço: 1209 Mountain Road Place Northeast, Albuquerque, New Mexico, 87110, USA.
          </p>
        </div>
      </div>
    </div>
  )
}
