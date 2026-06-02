import Image from "next/image"

export default function InvestmentSection() {
  const features = [
    {
      icon: (
        <Image
          src="/images/design-mode/1_Antibacterial-and-Non-Toxic.svg"
          alt="Antibacterial and Non-Toxic Surface"
          width={64}
          height={64}
          className="w-16 h-16 mx-auto mb-4"
        />
      ),
      title: "Superfície antibacteriana e não tóxica",
      description:
        "Ao contrário da madeira ou de outros materiais, a superfície não porosa do titânio impede que bactérias fiquem presas em seu interior. Basta enxaguar com água e pronto.",
    },
    {
      icon: (
        <Image
          src="/images/design-mode/2_Knife-Friendly.svg"
          alt="Antibacterial and Non-Toxic Surface"
          width={64}
          height={64}
          className="w-16 h-16 mx-auto mb-4"
        />
      ),
      title: "Construção amigável para facas",
      description:
        "A superfície da tábua de corte Katuchef foi especialmente projetada para ser delicada com suas facas. Ela ajuda a manter suas lâminas afiadas por mais tempo, evitando que você precise afiá-las com tanta frequência.",
    },
    {
      icon: (
        <Image
          src="/images/design-mode/3_Scratch-Resistance-and.svg"
          alt="Antibacterial and Non-Toxic Surface"
          width={64}
          height={64}
          className="w-16 h-16 mx-auto mb-4"
        />
      ),
      title: "Resistência a riscos e durabilidade",
      description:
        "O Katuchef foi projetado para suportar o uso diário sem apresentar sinais de desgaste. Ele resiste a arranhões, amassados e deformações, e permanece em ótimas condições, independentemente de quanto você o prepare. Durará a vida toda.",
    },
    {
      icon: (
        <Image
          src="/images/design-mode/4_Dual-Sided.svg"
          alt="Antibacterial and Non-Toxic Surface"
          width={64}
          height={64}
          className="w-16 h-16 mx-auto mb-4"
        />
      ),
      title: "Versatilidade Dupla Face",
      description:
        "O design duplo do Katuchef permite que você mantenha alimentos crus e cozidos separados, tornando o preparo das refeições mais seguro e fácil. É uma maneira simples de evitar contaminação cruzada e economizar tempo na cozinha.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Invista em uma tábua de corte que durará a vida toda
          </h2>
          <p className="text-lg text-gray-600 mb-6">Esta tábua de corte de titânio cuida de tudo na sua cozinha</p>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
            As tábuas de corte Katuchef são projetadas para oferecer a você a mais alta qualidade no preparo de
            alimentos. Com recursos que priorizam segurança, praticidade e durabilidade, a Katuchef torna cada refeição
            mais saudável, segura e prazerosa de preparar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className="text-gray-700 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
