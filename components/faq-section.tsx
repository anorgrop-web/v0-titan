"use client"

import { useState } from "react"

const faqs = [
  {
    question: "Quais São Os Benefícios De Usar A Tábua De Corte Katuchef?",
    answer:
      "A tábua de corte Katuchef é altamente durável, resistente a arranhões e amassados, o que garante longevidade. A superfície de titânio não porosa previne o acúmulo de bactérias e permite um ambiente higiênico para o preparo de alimentos. Essas tábuas são delicadas com as facas, ajudando a manter o fio da lâmina ao longo do tempo.",
  },
  {
    question: "A Tábua De Corte Katuchef É Segura Para Uso?",
    answer:
      "Sim, o Katuchef é seguro para todos os tipos de preparo de alimentos. O material de titânio não é tóxico e não libera substâncias químicas nocivas para os alimentos. Sua natureza não porosa também significa que não abriga bactérias, tornando-o uma escolha higiênica para sua cozinha.",
  },
  {
    question: "Como Faço A Limpeza E A Manutenção Do Meu Katuchef?",
    answer:
      "Após cada uso, lave com água morna e sabão neutro e seque imediatamente com um pano macio para evitar manchas de água. Evite usar produtos de limpeza abrasivos ou esponjas de aço, pois podem danificar a superfície. A limpeza regular ajudará a manter sua aparência e higiene.",
  },
  {
    question: "Usar A Tábua De Corte Katuchef Deixará Minhas Facas Cegas?",
    answer:
      "Não, o Katuchef foi projetado para ser delicado com suas facas. A superfície de titânio minimiza o desgaste das lâminas e ajuda a manter suas facas afiadas por mais tempo em comparação com superfícies mais duras, como vidro ou cerâmica.",
  },
  {
    question: "As Placas Katuchef São Resistentes Ao Calor?",
    answer:
      "Sim, as tábuas de corte Katuchef têm excelente resistência ao calor. Você pode colocar panelas ou frigideiras quentes diretamente sobre a tábua com segurança, sem se preocupar com deformações ou danos.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perguntas frequentes</h2>
          <div className="w-16 h-1 bg-gray-400 mx-auto"></div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">{faq.question}</span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="text-gray-700 leading-relaxed">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
