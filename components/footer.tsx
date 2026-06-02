import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Benefits Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div
                className="w-8 h-8 bg-gray-800 rounded"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 8h4v4H8V8zm6 0h4v4h-4V8zm6 0h4v4h-4V8zM8 14h4v4H8v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM8 20h4v4H8v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z' fill='%23000'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
            <h3 className="font-semibold text-sm mb-1">TITÂNIO PURO</h3>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-6 border-2 border-white rounded-sm relative">
                  <div className="absolute top-1 left-1 w-1 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">DURABILIDADE VITALÍCIA</h3>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                $
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">GARANTIA DE REEMBOLSO DE 90 DIAS</h3>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 relative">
                  <div className="absolute inset-0 border-2 border-white rounded-full" />
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1">ANTIBACTERIANO E LIVRE DE BPA</h3>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Logo and Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">
              KATU<span className="text-red-500">CHEF</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A tábua de corte Katuchef oferece uma superfície atóxica, higiênica e adequada para facas em todas as
              refeições. Esqueça bactérias, manchas e trocas constantes – a Katuchef mantém sua cozinha mais limpa,
              segura e pronta para tudo, desde jantares diários até aventuras de acampamento.
            </p>
          </div>

          {/* Customer Service */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-center">ATENDIMENTO AO CLIENTE</h3>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>Envie-Nos Um E-Mail</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span>Chat Ao Vivo 24 Horas Por Dia, 7 Dias Por Semana</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>+1 (209) 806-4881</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">INFORMAÇÃO</h4>
                <ChevronDown className="w-5 h-5" />
              </div>
              <div className="space-y-3 text-gray-300">
                <div>Termos E Condições</div>
                <div>Política De Privacidade</div>
                <div>Perguntas Frequentes</div>
                <div>Afiliado</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">ORDEM</h4>
                <ChevronDown className="w-5 h-5" />
              </div>
              <div className="space-y-3 text-gray-300">
                <div>Envio E Entrega</div>
                <div>Devoluções E Reembolsos</div>
                <div>Contato</div>
                <div>Rastreie Seu Pedido</div>
              </div>
            </div>
          </div>

          {/* Copyright and Payment Methods */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-4">© 2025 Katuchef | Todos os direitos reservados</p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                <img src="/visa-logo-generic.png" alt="Visa" className="h-6" />
                <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                <img src="/american-express-logo.png" alt="Amex" className="h-6" />
                <img src="/apple-pay-logo.png" alt="Apple Pay" className="h-6" />
                <img src="/diners-club-logo.png" alt="Diners" className="h-6" />
                <img src="/klarna-logo.png" alt="Klarna" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
