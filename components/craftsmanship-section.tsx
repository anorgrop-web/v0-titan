import Image from "next/image"

export default function CraftsmanshipSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Artesanato em titânio puro para uma cozinha mais limpa e segura
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
            Transforme a preparação das suas refeições com a tábua de corte higiênica e durável da Katuchef
          </p>
          <div className="w-16 h-1 bg-gray-400 mx-auto"></div>
        </div>

        {/* First Feature - Sem germes, bactérias ou microplásticos */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Sem germes, bactérias ou microplásticos
              </h3>
              <div className="w-12 h-1 bg-gray-400 mb-6"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                A superfície antibacteriana do Katuchef mantém sua cozinha mais limpa e segura, impedindo o acúmulo de
                bactérias. Feito de titânio atóxico, o Katuchef é livre de produtos químicos nocivos e garante um
                preparo de refeições mais seguro para você e sua família.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <Image
                  src="/images/design-mode/Stream-iframe%20videodelivery.gif"
                  alt="Tábua de corte com marcas de uso mostrando resistência"
                  width={500}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Second Feature - Elimina a contaminação cruzada */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className="relative">
                <Image
                  src="/images/design-mode/Pure%20Titanium%20Cutting%20Board.gif"
                  alt="Pessoa cortando maçã na tábua de titânio"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            <div className="order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Elimina a contaminação cruzada de alimentos
              </h3>
              <div className="w-12 h-1 bg-gray-400 mb-6"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Seja para cortar, trinchar ou servir, o Katuchef faz tudo. O design com dupla face permite separar
                alimentos crus e cozidos, para que você possa preparar cada prato com cuidado.
              </p>
            </div>
          </div>
        </div>

        {/* Third Feature - Titânio cortado a laser */}
        <div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">Titânio cortado a laser</h3>
              <div className="w-12 h-1 bg-gray-400 mb-6"></div>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Suas facas vão adorar Katuchef tanto quanto você. Ao contrário das tábuas de vidro, que perdem o fio
                rapidamente, a superfície da Katuchef é amiga das facas, preservando o fio e prolongando a vida útil dos
                seus utensílios de cozinha.
              </p>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/images/design-mode/1_Versatile-for-Any.svg"
                      alt="Versatile for any occasion icon"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Versátil para qualquer ocasião</h4>
                    <p className="text-gray-600">
                      Seja para fatiar vegetais, cortar carnes ou preparar refeições ao ar livre, o design leve e
                      resistente ao calor do Katuchef oferece a superfície perfeita.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/images/design-mode/2_Built-to.svg"
                      alt="Built to last icon"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Construído para durar</h4>
                    <p className="text-gray-600">
                      Feito de titânio puro, o Katuchef resiste a arranhões, deformações e desgaste, proporcionando uma
                      vida inteira de uso confiável.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/images/design-mode/3_No-Upkeep.svg"
                      alt="No upkeep needed icon"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Não requer manutenção</h4>
                    <p className="text-gray-600">
                      Katuchef é resistente a manchas, odores e arranhões. Basta uma lavagem rápida para mantê-lo limpo
                      – sem necessidade de óleo ou limpeza profunda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <Image
                  src="/images/design-mode/20250826_2034_Tabuas%20de%20Corte%20Elegantes_remix_01k3mbmn9meysrfewqn994zs3b.png"
                  alt="Duas tábuas de titânio com alimentos separados"
                  width={500}
                  height={600}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
