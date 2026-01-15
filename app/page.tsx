"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ComparisonSection from "@/components/comparison-section"
import BenefitsSection from "@/components/benefits-section"
import CraftsmanshipSection from "@/components/craftsmanship-section"
import InvestmentSection from "@/components/investment-section"
import CompetitorComparisonSection from "@/components/competitor-comparison-section"
import TestimonialsSection from "@/components/testimonials-section"
import ReviewsSection from "@/components/reviews-section"
import ExpertSection from "@/components/expert-section"
import FaqSection from "@/components/faq-section"
import GuaranteeSection from "@/components/guarantee-section"
import Footer from "@/components/footer"
import FixedConversionBar from "@/components/fixed-conversion-bar"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <HeroSection isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
      <div id="como-funciona">
        <ComparisonSection />
      </div>
      <div id="caracteristicas">
        <BenefitsSection />
      </div>
      <CraftsmanshipSection />
      <InvestmentSection />
      <CompetitorComparisonSection />
      <div id="avaliacoes">
        <TestimonialsSection />
      </div>
      <ReviewsSection />
      <ExpertSection />
      <div id="faq">
        <FaqSection />
      </div>
      <GuaranteeSection />
      <div id="contato">
        <Footer />
      </div>
      <FixedConversionBar isModalOpen={isModalOpen} />
    </main>
  )
}
