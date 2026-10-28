import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

const defaultSlides = [
  {
    id: 1,
    tag: "Collection Cérémonie & Prestige",
    titleLine1: "L'Honneur & la Grâce",
    titleLine2: "Haute Couture Homme",
    subtitle: "Grands Boubous d'Honneur et ensembles d'apparat confectionnés sur mesure dans les plus nobles étoffes d'Afrique de l'Ouest.",
    primaryCta: "Sur Mesure",
    secondaryCta: "Prêt-à-Porter",
    modelImage: "/uploads/hero_slide_1.jpg",
    featuredProduct: {
      id: "ready-004",
      name: "Oud Al-Maliki 100ml Pur",
      price: "55 000 FCFA",
      image: "/uploads/hero_prod_oud.jpg"
    }
  },
  {
    id: 2,
    tag: "Senator & Kaftans Modernes",
    titleLine1: "L'Art de l'Allure",
    titleLine2: "Coupe Royale & Pure",
    subtitle: "Ensembles Senator en laine vierge Super 140s et Kaftans minimalistes pour réceptions d'affaires et cérémonies officielles.",
    primaryCta: "Confection Senator",
    secondaryCta: "Boutique Showroom",
    modelImage: "/uploads/hero_slide_2.jpg",
    featuredProduct: {
      id: "ready-001",
      name: "Fila Aso-Oke Tissé Main",
      price: "32 000 FCFA",
      image: "/uploads/hero_prod_fila.jpg"
    }
  },
  {
    id: 3,
    tag: "Parfumerie Rare & Accessoires",
    titleLine1: "Sillage d'Exception",
    titleLine2: "Oud Pur & Cuir Noble",
    subtitle: "Extraits purs d'Oud de 12 ans, attars orientaux sans alcool, babouches royales brodées main et ceintures pleine fleur.",
    primaryCta: "Explorer Parfums",
    secondaryCta: "Prendre Rendez-vous",
    modelImage: "/uploads/hero_slide_3.jpg",
    featuredProduct: {
      id: "ready-013",
      name: "Babouches Royales en Cuir",
      price: "48 000 FCFA",
      image: "/uploads/hero_prod_shoe.jpg"
    }
  }
];

export default function HeroSection({ 
  heroSlides = defaultSlides,
  onExploreBespoke, 
  onExploreReadyToWear, 
  onQuickOrder,
  settings 
}) {
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFloatingCard, setShowFloatingCard] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5.5 seconds unless user hovers
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const safeSlideIndex = currentSlide < slides.length ? currentSlide : 0;
  const slide = slides[safeSlideIndex] || defaultSlides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-[#edf4f2] overflow-hidden pt-6 pb-14 sm:pb-16 lg:pb-20 border-b border-slate-200/80 select-none"
    >
      
      {/* Decorative background circle behind model */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] rounded-full bg-[#dbe8e4] -z-0 pointer-events-none transition-all duration-700 opacity-90" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Bannière précédente"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all border border-slate-200/60"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Bannière suivante"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all border border-slate-200/60"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 2-Column Hero Grid with smooth fade transition */}
        <div 
          key={slide.id || safeSlideIndex}
          className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] animate-fadeIn"
        >
          
          {/* Left Column : Editorial Typography & CTAs */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 pl-6 sm:pl-10 lg:pl-4">
            
            {/* Category Subtitle / Tag */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wider uppercase block">
                {slide.tag || "Maison de Haute Couture"}
              </span>

              {/* Bold 2-Line Headline */}
              <h1 className="font-sans text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                <span className="block">{slide.titleLine1 || "L'Honneur & la Grâce"}</span>
                <span className="block mt-1">{slide.titleLine2 || "Haute Couture Homme"}</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed font-normal">
              {slide.subtitle}
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onExploreBespoke}
                className="py-3 px-6 sm:px-7 rounded-lg bg-black hover:bg-slate-900 text-white font-medium text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-sm group"
              >
                <span>{slide.primaryCta || "Sur Mesure"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreReadyToWear}
                className="py-3 px-6 sm:px-7 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-medium text-xs sm:text-sm border border-slate-200/80 transition-all shadow-sm"
              >
                <span>{slide.secondaryCta || "Prêt-à-Porter"}</span>
              </button>
            </div>

          </div>

          {/* Right Column : Fashion Portrait Model with soft backdrop disk */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
              <img
                src={slide.modelImage || "/uploads/hero_slide_1.jpg"}
                alt="TAY Collections Haute Couture"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/uploads/hero_slide_1.jpg';
                }}
                className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-all duration-700"
              />
            </div>
          </div>

        </div>

        {/* Carousel Slide Indicators / Dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {slides.map((s, index) => {
            const isActive = index === safeSlideIndex;
            return (
              <button
                key={s.id || index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Aller à la slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>

      </div>

    </section>
  );
}
