import Image from "next/image"

export default function ExpertSection() {
  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Award Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-16 text-center">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Award Badge */}
            <div className="flex-shrink-0">
              <div className="bg-gray-800 text-white px-4 py-6 rounded-lg transform -rotate-3 shadow-lg">
                <div className="text-xs font-bold mb-1">BEST</div>
                <div className="text-xs mb-1">Cutting Board</div>
                <div className="text-sm font-bold mb-1">AWARD</div>
                <div className="text-sm font-bold mb-1">WINNER</div>
                <div className="text-xs">2025</div>
              </div>
            </div>

            {/* Award Content */}
            <div className="flex-1 text-center">
              {/* 5 Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Katuchef foi classificada como a melhor tábua de corte de titânio de 2025
              </h3>

              <p className="text-gray-600">- TopRatings.Review</p>
            </div>

            {/* Cutting Board Image - Desktop Only */}
            <div className="hidden lg:block flex-shrink-0">
              <Image
                src="/titanium-cutting-board-clean-modern.png"
                alt="Tábua de corte Katuchef"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Expert Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Conheça nosso especialista,</h2>

            <p className="text-lg text-gray-600 mb-8">Coach Culinário e Fundador da Katuchef</p>

            <div className="text-gray-700 leading-relaxed mb-8">
              <p>
                Com duas décadas de experiência como master chef da culinária japonesa, sei a importância da precisão e
                da limpeza em cada refeição. Uma faca cega ou uma superfície anti-higiênica podem arruinar não apenas o
                prato, mas toda a experiência. Tábuas de corte tradicionais simplesmente não atendem aos meus padrões.
                Motivado pelo meu compromisso com a qualidade, criei a tábua de corte Katuchef. Feita de titânio puro, a
                Katuchef é antibacteriana, não danifica facas e foi projetada para durar a vida toda, seja cozinhando em
                casa ou em uma cozinha profissional.
              </p>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-gray-600 mb-4">Kaito Mason</p>

              {/* Signature */}
              <div className="inline-block">
                <svg width="200" height="80" viewBox="0 0 200 80" className="text-gray-800">
                  <path
                    d="M20 40 Q30 20, 50 40 T90 40 M90 40 Q100 30, 120 50 Q140 60, 160 40 M160 40 Q170 30, 180 45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 55 Q35 45, 45 55 Q55 65, 65 55 M75 50 Q85 40, 95 50 Q105 60, 115 50"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Chef Photo */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <div className="w-80 h-96 lg:w-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/design-mode/RXhwZXJ0LTUuanBn.jpg"
                alt="Mason Carter - Chef e Fundador da Katuchef"
                width={384}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
