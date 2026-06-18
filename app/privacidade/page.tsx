import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Política de Privacidade | Titanus Cut®",
  description:
    "Política de Privacidade da Anor Commerce LLC, operando como Titanus Cut®. Saiba como coletamos, usamos, compartilhamos e protegemos os seus dados pessoais.",
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <article className="max-w-3xl mx-auto px-4 py-16">
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Política de Privacidade</h1>
          <p className="text-gray-600">Anor Commerce LLC, operando como Titanus Cut®</p>
          <p className="text-gray-500 text-sm mt-1">Data de vigência: 18 de junho de 2026</p>
        </header>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <p>
            Esta Política de Privacidade descreve como a Anor Commerce LLC, operando sob a marca comercial Titanus
            Cut®, coleta, utiliza, armazena, compartilha e protege as informações dos visitantes e clientes do site{" "}
            <a href="https://titanus.titanchefcut.com" className="text-gray-900 underline">
              https://titanus.titanchefcut.com
            </a>
            . Ao utilizar o nosso site e os nossos serviços, você concorda com as práticas descritas neste documento.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Quem somos</h2>
            <p>
              O site é operado pela Anor Commerce LLC, uma sociedade de responsabilidade limitada registrada no Estado
              do Novo México, Estados Unidos da América, que atua comercialmente sob a marca Titanus Cut®. Quando esta
              política menciona &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;Titanus Cut®&rdquo;, refere-se à Anor
              Commerce LLC.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Razão social:</strong> Anor Commerce LLC
              </li>
              <li>
                <strong>Endereço:</strong> 1209 Mountain Road Pl NE, STE R, Albuquerque, NM 87110, Estados Unidos
              </li>
              <li>
                <strong>E-mail:</strong>{" "}
                <a href="mailto:support@titanchefcut.com" className="text-gray-900 underline">
                  support@titanchefcut.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Quais dados coletamos</h2>
            <p>Coletamos as informações necessárias para processar seus pedidos e melhorar a sua experiência:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Dados de identificação e contato:</strong> nome completo, endereço de e-mail e número de
                telefone.
              </li>
              <li>
                <strong>Endereço de entrega:</strong> endereço completo necessário para o envio dos produtos.
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados de forma segura por processadores de pagamento
                terceirizados. Não armazenamos os dados completos do seu cartão em nossos servidores.
              </li>
              <li>
                <strong>Dados de navegação:</strong> endereço IP, tipo de navegador, dispositivo, páginas visitadas,
                tempo de permanência e dados coletados por cookies e tecnologias de rastreamento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Como usamos seus dados</h2>
            <p>Utilizamos os dados coletados para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Processar, confirmar e entregar os seus pedidos;</li>
              <li>Enviar atualizações sobre o status do pedido e comunicações relacionadas ao atendimento;</li>
              <li>Responder a dúvidas, solicitações e pedidos de suporte;</li>
              <li>Melhorar o desempenho, a segurança e a usabilidade do nosso site;</li>
              <li>
                Enviar comunicações de marketing e promoções, sempre que você tiver fornecido o seu consentimento;
              </li>
              <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies e tecnologias de rastreamento</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para analisar o tráfego, personalizar conteúdo e medir a
              eficácia das nossas campanhas. Entre as ferramentas que utilizamos estão:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Google Analytics</strong> — análise de tráfego e comportamento de navegação;
              </li>
              <li>
                <strong>Google Tag Manager</strong> — gerenciamento de tags e scripts de medição;
              </li>
              <li>
                <strong>Meta Pixel (Facebook Pixel)</strong> — mensuração e otimização de anúncios;
              </li>
              <li>
                <strong>UTMify</strong> — atribuição e acompanhamento de campanhas.
              </li>
            </ul>
            <p className="mt-3">
              Você pode gerenciar ou desativar os cookies por meio das configurações do seu navegador. A desativação de
              determinados cookies pode afetar o funcionamento de algumas partes do site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Compartilhamento de dados com terceiros</h2>
            <p>
              Não vendemos os seus dados pessoais. Compartilhamos informações apenas com parceiros necessários para a
              operação do nosso negócio, tais como:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Processadores de pagamento, para autorizar e concluir as transações;</li>
              <li>Plataformas de envio e transportadoras, para realizar a entrega dos pedidos;</li>
              <li>Ferramentas de analytics e publicidade, para mensurar e otimizar campanhas;</li>
              <li>Autoridades públicas, quando exigido por lei ou para proteger os nossos direitos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seus direitos</h2>
            <p>Você tem o direito de:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Acessar os dados pessoais que mantemos sobre você;</li>
              <li>Solicitar a correção de dados incorretos ou desatualizados;</li>
              <li>Solicitar a exclusão dos seus dados, observadas as obrigações legais de retenção;</li>
              <li>Revogar, a qualquer momento, o consentimento concedido para o recebimento de marketing.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:support@titanchefcut.com" className="text-gray-900 underline">
                support@titanchefcut.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Segurança dos dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger os seus dados pessoais contra acesso
              não autorizado, perda, alteração ou divulgação indevida. Apesar dos nossos esforços, nenhum método de
              transmissão pela internet ou de armazenamento eletrônico é totalmente seguro, e não podemos garantir
              segurança absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas
              ou na legislação aplicável. A versão mais recente estará sempre disponível nesta página, com a respectiva
              data de vigência atualizada. Recomendamos que você revise este documento regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais,
              entre em contato conosco:
            </p>
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
