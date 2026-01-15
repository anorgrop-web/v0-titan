"use client"

import { useState } from "react"
import Image from "next/image"

const ReviewsSection = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const reviews = [
    {
      id: 1,
      name: "LuÍsa Paliciano.",
      avatar: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/MV9MaXNhLmpwZw-w_120-h_120-fit_crop.jpg",
      rating: 5,
      daysAgo: 6,
      verified: true,
      recommended: true,
      title: "Ótimo para chefs do dia a dia",
      content:
        "Cozinho todos os dias, e o Titanchef foi a melhor atualização para a nossa cozinha. É leve, fácil de limpar e adoro que não deforme nem manche como minhas antigas tábuas de plástico/madeira.",

      helpful: 24,
      notHelpful: 0,
    },
    {
      id: 2,
      name: "Amanda Vicentino.",
      avatar:
        "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/Ml9BbWFuZGEtVi5qcGc-w_120-h_120-fit_crop.jpg",
      rating: 5,
      daysAgo: 5,
      verified: true,
      recommended: true,
      title: "Mantém minhas facas afiadas",
      content:
        "Não achei que seria tão bom, mas esta tábua de corte realmente preservou minhas facas. Estou usando há meses e minhas lâminas estão afiadas como sempre. Chega de lâminas cegas após um único uso...",
      helpful: 17,
      notHelpful: 0,
    },
    {
      id: 3,
      name: "João Luis.",
      avatar: "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/M19Kb2huLUwuanBn-w_120-h_120-fit_crop.jpg",
      rating: 5,
      daysAgo: 5,
      verified: true,
      recommended: true,
      title: "Indispensável para acampar",
      content:
        "O mais prático para acampar, pode ser usado como tábua de corte ou apenas como superfície para colocar coisas. A melhor parte é que, obviamente, não é preciso raspar durante a limpeza. Uma ferramenta incrível.",
      helpful: 26,
      notHelpful: 0,
    },
    {
      id: 4,
      name: "Christina Kill.",
      avatar:
        "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com/Tabua/Q2hyaXN0aWUtSy5qcGc-w_120-h_120-fit_crop.jpg",
      rating: 4,
      daysAgo: 4,
      verified: true,
      recommended: true,
      title: "Cozinha mais limpa e segura",
      content:
        "Depois de aprender a quantidade de bactérias que as tábuas de plástico podem reter, mudei para Titanchef. Me sinto muito melhor sabendo que estou preparando comida em uma superfície higiênica. Além disso, é muito fácil lavar as ranhuras da escova por horas.",
      helpful: 14,
      notHelpful: 0,
    },
    {
      id: 5,
      name: "Danielle S.",
      avatar: "/professional-woman.png",
      rating: 5,
      daysAgo: 3,
      verified: true,
      recommended: true,
      title: "Chega de contaminação cruzada",
      content:
        "O design dos dois lados é incrível... Eu uso um lado para carne e o outro para vegetais. Torna o preparo das refeições mais rápido e muito mais seguro. Recomendo muito, pessoal!",
      helpful: 11,
      notHelpful: 0,
    },
    {
      id: 6,
      name: "Jamie V.",
      avatar: "/person-kitchen.png",
      rating: 5,
      daysAgo: 2,
      verified: true,
      recommended: true,
      title: "Vai durar a vida toda",
      content:
        "Já usei muitas tábuas de corte ao longo dos anos, mas a Titanchef é única, sério. Ela é praticamente indestrutível, e adoro saber que não terei que substituí-la tão cedo.",
      helpful: 12,
      notHelpful: 0,
    },
    {
      id: 7,
      name: "Mônica S.",
      avatar: "/woman-chef-professional.png",
      rating: 5,
      daysAgo: 2,
      verified: true,
      recommended: true,
      title: "Incrível para cozinhas movimentadas",
      content:
        "Tenho um pequeno negócio de buffet, e o Titanchef tem sido perfeito para manter tudo limpo e eficiente. Não mancha, não cheira e é resistente o suficiente para suportar o uso constante. Nota 10/10.",
      helpful: 7,
      notHelpful: 0,
    },
    {
      id: 8,
      name: "Taya K.",
      avatar: "/young-woman-smiling.png",
      rating: 5,
      daysAgo: 1,
      verified: true,
      recommended: true,
      title: "Ferramenta excelente e acessível",
      content:
        "É lindo, funcional e deixa minha cozinha com um toque muito mais sofisticado. Não imaginei que uma tábua de corte pudesse ficar tão bonita, mas Titanchef me provou o contrário, haha.",
      helpful: 9,
      notHelpful: 0,
    },
  ]

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const StarIcon = () => (
    <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )

  const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.292a1 1 0 011.789 2.894z"
        clipRule="evenodd"
      />
    </svg>
  )

  const ThumbsUpIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v4M2 13h8a2 2 0 002-2V9a2 2 0 00-2-2H2v6z"
      />
    </svg>
  )

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Milhares de usuários felizes do Titanchef
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Leia as avaliações de clientes satisfeitos da Titanchef ao redor do mundo!
          </p>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-12"></div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg p-8 mb-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating Overview */}
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-gray-900 mb-2">4.7</div>
              <div className="flex justify-center md:justify-start mb-2">
                {[...Array(4)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
                <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id="half-star">
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#E5E7EB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#half-star)"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">1.888 avaliações</p>

              {/* Rating Bars */}
              <div className="space-y-2">
                {[
                  { stars: 5, count: 1134, percentage: 60 },
                  { stars: 4, count: 736, percentage: 39 },
                  { stars: 3, count: 14, percentage: 1 },
                  { stars: 2, count: 4, percentage: 0.2 },
                  { stars: 1, count: 0, percentage: 0 },
                ].map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-2 text-sm">
                    <span className="w-2">{rating.stars}</span>
                    <StarIcon />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${rating.percentage}%` }}></div>
                    </div>
                    <span className="w-12 text-right text-gray-600">{rating.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Stats */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  95% dos revisores recomendariam este produto a um amigo
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Satisfação", percentage: 95 },
                    { label: "Qualidade", percentage: 98 },
                    { label: "Resultados", percentage: 97 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{metric.label}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: `${metric.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full md:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                Escrever uma avaliação
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List - Desktop */}
        <div className="hidden md:block space-y-8">
          {reviews.slice(0, 4).map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0" style={{ width: "50px", height: "50px" }}>
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon />
                        <span>Cliente verificado</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 mb-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.daysAgo} dias atrás</span>
                    </div>
                  </div>

                  {review.recommended && (
                    <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
                      <ThumbsUpIcon />
                      <span>Eu recomendo este produto</span>
                    </div>
                  )}

                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700 mb-4">{review.content}</p>

                  {review.image && (
                    <div className="mb-4">
                      <Image
                        src={review.image || "/placeholder.svg"}
                        alt="Review image"
                        width={120}
                        height={120}
                        className="rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Esta avaliação foi útil?</span>
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <ThumbsUpIcon />
                      {review.helpful}
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v4M2 13h8a2 2 0 002-2V9a2 2 0 00-2-2H2v6z"
                        />
                      </svg>
                      {review.notHelpful}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Carousel - Mobile */}
        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div key={review.id} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0" style={{ width: "50px", height: "50px" }}>
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckIcon />
                                <span>Cliente verificado</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex gap-1 mb-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <StarIcon key={i} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.daysAgo} dias atrás</span>
                            </div>
                          </div>

                          {review.recommended && (
                            <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
                              <ThumbsUpIcon />
                              <span>Eu recomendo este produto</span>
                            </div>
                          )}

                          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                          <p className="text-gray-700 mb-4">{review.content}</p>

                          {review.image && (
                            <div className="mb-4">
                              <Image
                                src={review.image || "/placeholder.svg"}
                                alt="Review image"
                                width={120}
                                height={120}
                                className="rounded-lg"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Esta avaliação foi útil?</span>
                            <button className="flex items-center gap-1 hover:text-gray-900">
                              <ThumbsUpIcon />
                              {review.helpful}
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-900">
                              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v4M2 13h8a2 2 0 002-2V9a2 2 0 00-2-2H2v6z"
                                />
                              </svg>
                              {review.notHelpful}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReviewIndex ? "bg-gray-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
