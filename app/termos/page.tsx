import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Termos e Condições | Titanus Cut®",
  description:
    "Termos e Condições de uso e compra da Anor Commerce LLC, operando como Titanus Cut®. Leia as regras aplicáveis ao uso do site e aos pedidos.",
}

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="max-w-3xl mx-auto px-4 py-16">
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Termos e Condições</h1>
          <p className="text-gray-600">Anor Commerce LLC, operando como Titanus Cut®</p>
          <p className="text-gray-500 text-sm mt-1">Data de vigência: 18 de junho de 2026</p>
        </header>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p>
            Estes Termos e Condições regem o uso do site{" "}
            <a href="https://titanus.titanchefcut.com" className="text-gray-900 underline">
              https://titanus.titanchefcut.com
            </a>{" "}
            e a compra de produtos da marca Titanus Cut®, operada pela Anor Commerce LLC. Ao acessar o site ou realizar
            uma compra, você concorda com os termos descritos abaixo.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceitação dos termos</h2>
            <p>
              Ao acessar e utilizar este site, você declara ter lido, compreendido e aceito estes Termos e Condições, bem
              como a nossa Política de Privacidade. Caso não concorde com qualquer parte destes termos, você não deve
              utilizar o site nem realizar pedidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Descrição do serviço e do produto</h2>
            <p>
              A Anor Commerce LLC comercializa a tábua de corte de titânio Titanus Cut® e produtos relacionados por meio
              deste site. Empenhamo-nos para que as descrições, imagens e especificações dos produtos sejam precisas;
              no entanto, podem ocorrer pequenas variações de cor ou apresentação em razão das configurações de
              exibição de cada dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Preços e pagamento</h2>
            <p>
              Todos os preços são exibidos no site e podem ser alterados a qualquer momento, sem aviso prévio.
              Promoções e descontos são válidos apenas durante o período divulgado. O pagamento é processado por
              processadores de pagamento terceirizados e seguros, e o pedido somente será confirmado após a aprovação
              da transação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Envio e entrega</h2>
            <p>
              Os prazos de envio e entrega são estimativas e podem variar conforme a localidade de destino e fatores
              operacionais ou logísticos alheios ao nosso controle. Após a expedição, eventuais atrasos decorrentes da
              transportadora ou de autoridades aduaneiras não são de responsabilidade da Anor Commerce LLC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Política de devoluções e reembolsos</h2>
            <p>
              Oferecemos uma garantia de reembolso de 90 dias. Caso você não fique satisfeito com a sua compra, poderá
              solicitar a devolução dentro de 90 dias a contar da data de recebimento do produto. Para iniciar uma
              solicitação de devolução ou reembolso, entre em contato pelo e-mail{" "}
              <a href="mailto:support@titanchefcut.com" className="text-gray-900 underline">
                support@titanchefcut.com
              </a>
              . Os reembolsos aprovados serão processados pelo mesmo método de pagamento utilizado na compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Propriedade intelectual</h2>
            <p>
              A marca Titanus Cut®, o logotipo, os textos, as imagens e demais conteúdos deste site são de propriedade
              da Anor Commerce LLC ou de seus licenciadores e estão protegidos pelas leis de propriedade intelectual
              aplicáveis. É proibida a reprodução, distribuição ou utilização desses materiais sem autorização prévia e
              por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitação de responsabilidade</h2>
            <p>
              Na máxima extensão permitida pela lei aplicável, a Anor Commerce LLC não será responsável por quaisquer
              danos indiretos, incidentais ou consequenciais decorrentes do uso do site ou dos produtos. Os produtos
              devem ser utilizados conforme as instruções de uso e conservação fornecidas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Lei aplicável</h2>
            <p>
              Estes Termos e Condições são regidos e interpretados de acordo com as leis do Estado do Novo México,
              Estados Unidos da América, independentemente de conflitos de disposições legais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Alterações nos termos</h2>
            <p>
              Podemos revisar e atualizar estes Termos e Condições a qualquer momento. A versão vigente estará sempre
              disponível nesta página, com a respectiva data de vigência atualizada. O uso continuado do site após
              eventuais alterações constitui aceitação dos termos revisados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contato</h2>
            <p>Em caso de dúvidas sobre estes Termos e Condições, entre em contato conosco:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Anor Commerce LLC</strong>
              </li>
              <li>1209 Mountain Road Pl NE, STE R, Albuquerque, NM 87110, Estados Unidos</li>
              <li>
                <a href="mailto:support@titanchefcut.com" className="text-gray-900 underline">
                  support@titanchefcut.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
