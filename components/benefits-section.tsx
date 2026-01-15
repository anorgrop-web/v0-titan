import Image from "next/image"

export default function BenefitsSection() {
  const benefits = [
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/svgt1%20%281%29.svg"
          alt="Titânio resistente a riscos"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      ),
      text: "Titânio resistente a riscos",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/facasvg%20%281%29.svg"
          alt="Titânio resistente a riscos"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      ),
      text: "Superfície adequada para facas",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/3_Antibacterial-and-Non.svg"
          alt="Titânio resistente a riscos"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      ),
      text: "Antibacteriano e não tóxico",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/4_Heat-Proof.svg"
          alt="Titânio resistente a riscos"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      ),
      text: "Durabilidade à prova de calor",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/5_Double-Sided.svg"
          alt="Titânio resistente a riscos"
          width={38}
          height={38}
          className="w-8 h-8"
        />
      ),
      text: "Design de dupla face",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/6_Modern.svg"
          alt="Titânio resistente a riscos"
          width={38}
          height={38}
          className="w-8 h-8"
        />
      ),
      text: "Estética Moderna",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/7_Built-to-Last-a.svg"
          alt="Titânio resistente a riscos"
          width={38}
          height={38}
          className="w-8 h-8"
        />
      ),
      text: "Feito para durar a vida toda",
    },
    {
      icon: (
        <Image
          src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/s3/8_Resistant-to-Odors-and.svg"
          alt="Titânio resistente a riscos"
          width={38}
          height={38}
          className="w-8 h-8"
        />
      ),
      text: "Resistente a odores e manchas",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Título e subtítulo */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que o titânio é a melhor escolha</h2>
          <p className="text-lg text-gray-600 mb-6">Sem manchas, sem odores, sem bactérias</p>
          <div className="w-16 h-1 bg-gray-400 mx-auto"></div>
        </div>

        {/* Layout Mobile - Lista vertical */}
        <div className="lg:hidden">
          <div className="flex justify-center mb-12">
            <div className="relative w-64 h-80">
              <Image
                src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/tabuadetitanio%20%281%29.png"
                alt="Tábua de corte de titânio"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 text-gray-700">{benefit.icon}</div>
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Desktop - 3 colunas */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12 lg:items-center">
          {/* Coluna esquerda - primeiros 4 benefícios */}
          <div className="space-y-8">
            {benefits.slice(0, 4).map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 text-gray-700">{benefit.icon}</div>
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Coluna central - imagem */}
          <div className="flex justify-center">
            <div className="relative w-80 h-96">
              <Image
                src="https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com/kat/lp/tabuadetitanio%20%281%29.png"
                alt="Tábua de corte de titânio"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Coluna direita - últimos 4 benefícios */}
          <div className="space-y-8">
            {benefits.slice(4, 8).map((benefit, index) => (
              <div key={index + 4} className="flex items-center gap-4">
                <div className="flex-shrink-0 text-gray-700">{benefit.icon}</div>
                <p className="text-gray-800 font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
