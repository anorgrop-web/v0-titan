"use client"

import { useState, useRef } from "react"

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      name: "Sara",
      // TODO rebrand: substituir vídeo de depoimento (arquivo "Depoimento katuchef 1.mp4") pela versão Titanus Cut® quando disponível
      video: "https://anorcorp.com/Tabua/Depoimento%20katuchef%201.mp4",
      rating: 5,
      text: "Adoro esta tábua de corte! É muito mais fácil de limpar do que a minha antiga tábua de madeira – chega de esfregar comida para tirar marcas de faca. Depois de 6 meses de uso intenso, ela ainda parece novinha em folha. Me sinto muito melhor sabendo que estou preparando um churrasco em uma superfície atóxica e antibacteriana!",
    },
    {
      name: "Olívia",
      // TODO rebrand: substituir vídeo de depoimento (arquivo "Depoimento katuchef 2.mp4") pela versão Titanus Cut® quando disponível
      video: "https://anorcorp.com/Tabua/Depoimento%20katuchef%202.mp4",
      rating: 5,
      text: "Eu tinha pavor de cortar legumes porque minhas facas ficavam cegas muito rápido nas minhas tábuas antigas. Com a tábua de corte Titanus Cut®, minhas facas ficam afiadas e eu não preciso ficar pegando o amolador. Você SIMPLESMENTE TEM que ter isso.",
    },
    {
      name: "Luciano",
      // TODO rebrand: substituir vídeo de depoimento (arquivo "depoimento katuchef 3.mp4") pela versão Titanus Cut® quando disponível
      video: "https://anorcorp.com/Tabua/depoimento%20katuchef%203.mp4",
      rating: 5,
      text: '"Troque a famosa tabua de madeira por essa de titanio. Realmente bem melhor, muito mais apresentável, muito mais higiênico, facil de limpar. Deixei as de madeira só de enfeite mesmo"',
    },
  ]

  const StarIcon = () => (
    <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Satisfação garantida com Titanus Cut®</h2>
          <p className="text-gray-600 text-lg mb-6">Redefina sua experiência na cozinha</p>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Milhares de clientes satisfeitos confiam na Titanus Cut® por sua durabilidade e segurança. Esqueça as tábuas de
            corte propensas a bactérias e as trocas constantes. Com esta tábua de corte de titânio de alta qualidade,
            você pode preparar refeições com confiança, sabendo que tem uma tábua de corte mais limpa e durável.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <VideoTestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <div className="lg:hidden relative">
          {/* Carrossel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-sm mx-auto">
                    <VideoTestimonialCard testimonial={testimonial} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setas de navegação */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-10"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-10"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores de slide */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VideoTestimonialCard({
  testimonial,
}: { testimonial: { name: string; video: string; rating: number; text: string } }) {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Video Container */}
      <div className="relative group">
        <video ref={videoRef} src={testimonial.video} autoPlay loop muted playsInline className="w-full h-auto" />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
            aria-label={isMuted ? "Desmutar" : "Mutar"}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all opacity-0 group-hover:opacity-100"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        {/* Name */}
        <h3 className="text-xl font-semibold text-black mb-3">{testimonial.name}</h3>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
