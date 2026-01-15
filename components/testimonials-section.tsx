"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import YouTube, { type YouTubePlayer, type YouTubeEvent } from "react-youtube"

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null)

  const testimonials = [
    {
      name: "Luciano",
      youtubeId: "1xTWDdXIfeY",
      rating: 5,
      text: '"Troque a famosa tabua de madeira por essa de titanio. Realmente bem melhor, muito mais apresentável, muito mais higiênico, facil de limpar. Deixei as de madeira só de enfeite mesmo"',
    },
    {
      name: "Cláudia",
      youtubeId: "wvMwWw8uuv0",
      rating: 5,
      text: "Eu tinha pavor de cortar legumes porque minhas facas ficavam cegas muito rápido nas minhas tábuas antigas. Com a tábua de corte Titanchef, minhas facas ficam afiadas e eu não preciso ficar pegando o amolador. Você SIMPLESMENTE TEM que ter isso.",
    },
    {
      name: "Sara",
      youtubeId: "BSGvtGJfZjs",
      rating: 5,
      text: "Adoro esta tábua de corte! É muito mais fácil de limpar do que a minha antiga tábua de madeira – chega de esfregar comida para tirar marcas de faca. Depois de 6 meses de uso intenso, ela ainda parece novinha em folha. Me sinto muito melhor sabendo que estou preparando um churrasco em uma superfície atóxica e antibacteriana!",
    },
  ]

  const handleSlideChange = (newSlide: number) => {
    setUnmutedIndex(null)
    setCurrentSlide(newSlide)
  }

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % testimonials.length)
  }

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    handleSlideChange(index)
  }

  const handleToggleMute = (index: number) => {
    if (unmutedIndex === index) {
      setUnmutedIndex(null)
    } else {
      setUnmutedIndex(index)
    }
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Satisfação garantida com Titanchef</h2>
          <p className="text-gray-600 text-lg mb-6">Redefina sua experiência na cozinha</p>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Milhares de clientes satisfeitos confiam na Titanchef por sua durabilidade e segurança. Esqueça as tábuas de
            corte propensas a bactérias e as trocas constantes. Com esta tábua de corte de titânio de alta qualidade,
            você pode preparar refeições com confiança, sabendo que tem uma tábua de corte mais limpa e durável.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <VideoTestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              isMuted={unmutedIndex !== index}
              onToggleMute={handleToggleMute}
            />
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
                    <VideoTestimonialCard
                      testimonial={testimonial}
                      index={index}
                      isMuted={unmutedIndex !== index}
                      onToggleMute={handleToggleMute}
                    />
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
  index,
  isMuted,
  onToggleMute,
}: {
  testimonial: { name: string; youtubeId: string; rating: number; text: string }
  index: number
  isMuted: boolean
  onToggleMute: (index: number) => void
}) {
  const playerRef = useRef<YouTubePlayer | null>(null)

  const onReady = useCallback((event: YouTubeEvent) => {
    playerRef.current = event.target
    event.target.mute()
    event.target.playVideo()
  }, [])

  useEffect(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.mute()
      } else {
        playerRef.current.unMute()
        playerRef.current.seekTo(0, true)
        playerRef.current.playVideo()
      }
    }
  }, [isMuted])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleMute(index)
  }

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      loop: 1,
      playlist: testimonial.youtubeId,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      fs: 0,
      disablekb: 1,
    },
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Video Container - aspect ratio 9:16 para Shorts */}
      <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
        <div className="absolute inset-0">
          <YouTube
            videoId={testimonial.youtubeId}
            opts={opts}
            onReady={onReady}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>

        {/* Mute/Unmute Button Overlay */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors z-10"
          aria-label={isMuted ? "Desmutar e reiniciar" : "Mutar"}
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
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-black mb-3">{testimonial.name}</h3>
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
