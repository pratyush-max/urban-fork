'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, Wine } from 'lucide-react';
import AmbientParticles from '../ui/AmbientParticles';

// Reusable Intersection Observer Video Player
interface LazyVideoProps {
  src: string;
}

function LazyVideo({ src }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Blocked by browser autoplay policies
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  const posterSrc = src.replace('.mp4', '.jpg').replace('/videos/', '/videos/posters/');

  return (
    <video
      ref={videoRef}
      src={src}
      poster={posterSrc}
      muted
      loop
      playsInline
      aria-hidden="true"
      preload="none"
      className="w-full h-full object-cover"
    />
  );
}

// Premium Monogram Placeholder for dishes without video assets
interface PlaceholderProps {
  name: string;
}

function PremiumPlaceholder({ name }: PlaceholderProps) {
  const monogram = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-tr from-[#171717] via-[#221c10] to-[#171717] flex items-center justify-center border-b border-[#D4AF37]/10">
      {/* Background monogram */}
      <span className="absolute text-[12rem] font-serif font-light text-[#D4AF37]/5 select-none pointer-events-none italic uppercase">
        {monogram}
      </span>
      {/* Center gold icon decoration */}
      <div className="relative z-10 flex flex-col items-center text-center p-6">
        <Sparkles className="text-[#D4AF37]/30 w-8 h-8 mb-4 animate-[pulse_3s_infinite_ease-in-out]" />
        <span className="font-serif text-[#D4AF37]/50 tracking-[0.2em] uppercase text-xs">
          Urban Fork Culinary
        </span>
      </div>
      {/* Glass shimmer glaze */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent mix-blend-overlay pointer-events-none" />
    </div>
  );
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  ingredients: string;
  recommendation: string;
  video?: string;
  prepStory: string;
  calories: string;
  pairing: string;
  chefNote: string;
  technique: string;
}

const menuData: Record<string, MenuItem[]> = {
  Starters: [
    {
      id: 'st-1',
      name: 'Citrus Cured Scallop',
      price: '$32',
      ingredients: 'Hokkaido scallops, blood orange reduction, finger lime, pickled sea fennel, bronze fennel fronds',
      recommendation: 'Pair with a crisp glass of 2022 Blanc de Blancs Champagne.',
      video: '/videos/scallop.mp4',
      prepStory: 'Cured for exactly 45 minutes in fresh citrus zest, sliced paper-thin to preserve delicate texture.',
      calories: '180 kcal',
      pairing: 'Chablis Premier Cru',
      chefNote: 'The acidity of the citrus highlights the natural sweetness of the cold-water scallop.',
      technique: 'Acid-curing & cold-pressing',
    },
    {
      id: 'st-2',
      name: 'Foie Gras Torchon',
      price: '$38',
      ingredients: 'Hudson Valley foie gras, Sauternes gelee, caramelized fig spread, toasted brioche',
      recommendation: 'Spread gently on warm brioche and let melt on the palate.',
      prepStory: 'Cured in sea salt and white port, poached gently in aromatic duck fat.',
      calories: '320 kcal',
      pairing: "2018 Chateau d'Yquem Sauternes",
      chefNote: 'Sauternes gelee provides the perfect sweet counterbalance to the rich torchon.',
      technique: 'Torchon slow-poaching',
    },
    {
      id: 'st-3',
      name: 'Heritage Heirloom Carpaccio',
      price: '$28',
      ingredients: 'Slow-roasted heirloom tomatoes, aged balsamic caviar, basil crystals, pine nut cream',
      recommendation: 'Enjoy with our house-baked rosemary focaccia.',
      prepStory: 'Tomatoes are dehydrated for 8 hours to intensify their natural sugars.',
      calories: '140 kcal',
      pairing: 'Vermentino di Sardegna',
      chefNote: 'A vegetarian tribute to Italian carpaccio, bursting with tomato umami.',
      technique: 'Dehydration & spherification',
    },
  ],
  Signature: [
    {
      id: 'sig-1',
      name: '72-Hour Smoked Duck Confit',
      price: '$72',
      ingredients: 'Slow-rendered heritage duck leg, sour cherry gastrique, roasted mission figs, parsnip puree',
      recommendation: 'Order medium-rare to experience the delicate crust and tender crumb.',
      video: '/videos/duck.mp4',
      prepStory: 'Cured in wild juniper and sea salt for 24 hours, then slow-cooked in rich duck fat.',
      calories: '620 kcal',
      pairing: 'Gevrey-Chambertin Pinot Noir',
      chefNote: 'The crisp skin balances the luscious melting texture of the meat.',
      technique: 'Confit & smoke-infusion',
    },
    {
      id: 'sig-2',
      name: 'Wagyu Ribeye Cap A5',
      price: '$145',
      ingredients: 'Miyazaki A5 Wagyu, charred green garlic, black garlic reduction, smoked sea salt flakes',
      recommendation: 'Savor slowly, letting the highly marbled meat melt at body temperature.',
      prepStory: 'Lightly seared over binchotan charcoal to achieve a caramelized outer crust.',
      calories: '780 kcal',
      pairing: '2015 Cabernet Sauvignon Napa Valley',
      chefNote: 'Simple accompaniments honor the pristine quality of this rare cut.',
      technique: 'Binchotan charcoal searing',
    },
    {
      id: 'sig-3',
      name: 'Truffle Agnolotti',
      price: '$58',
      ingredients: 'Hand-rolled pasta, liquid parmesan filling, shaved Alba white truffle, brown butter emulsion',
      recommendation: 'Eat each parcel in a single bite to release the liquid cheese center.',
      prepStory: 'Pasta sheets rolled to 1mm thickness, filled with a delicate hot cheese suspension.',
      calories: '450 kcal',
      pairing: 'Barolo Riserva',
      chefNote: 'White truffle needs fat to bloom; the brown butter sauce does exactly that.',
      technique: 'Emulsification & hand-extrusion',
    },
  ],
  Seafood: [
    {
      id: 'sea-1',
      name: 'Butter Poached Maine Lobster',
      price: '$85',
      ingredients: 'Atlantic lobster tail, saffron butter emulsion, sea asparagus, lemon verbena foam',
      recommendation: 'Squeeze the fresh finger lime over the lobster right before tasting.',
      prepStory: 'Poached gently at 62°C in clarified grass-fed butter to maintain perfect tenderness.',
      calories: '380 kcal',
      pairing: 'Puligny-Montrachet Chardonnay',
      chefNote: 'The saffron foam adds a floral, earthy depth to the sweet lobster.',
      technique: 'Sous-vide butter-poaching',
    },
    {
      id: 'sea-2',
      name: 'Crisp Skin Chilean Sea Bass',
      price: '$64',
      ingredients: 'Wild sea bass, ginger-dashi broth, baby bok choy, toasted sesame oil, ginger glaze',
      recommendation: 'Pour the warm dashi broth over the fish table-side.',
      prepStory: 'Pan-roasted skin-down on low heat to achieve a glass-like crispiness.',
      calories: '410 kcal',
      pairing: 'Dry German Riesling Spätlese',
      chefNote: 'The ginger broth cuts through the high fat content of the sea bass.',
      technique: 'Slow pan-searing & reduction',
    },
    {
      id: 'sea-3',
      name: 'Pan-Seared Diver Scallops',
      price: '$54',
      ingredients: 'Jumbo scallops, sunchoke puree, hazelnut brown butter, crispy pancetta lardons',
      recommendation: 'Gently dip scallops in the sunchoke puree for the ultimate pairing.',
      prepStory: 'Sourced daily, seared on a smoking hot plancha for exactly 90 seconds per side.',
      calories: '320 kcal',
      pairing: 'Meursault Chardonnay',
      chefNote: 'Hazelnuts mimic the nutty notes of seared scallop caramelized crust.',
      technique: 'Plancha high-heat searing',
    },
  ],
  Desserts: [
    {
      id: 'des-1',
      name: 'Gold Leaf Chocolate Dome',
      price: '$24',
      ingredients: '72% Valrhona dark chocolate, salted caramel core, hazelnut praline, edible 24k gold leaf',
      recommendation: 'Pour hot espresso ganache over the dome to witness the collapse.',
      prepStory: 'Molded in tempered chocolate shells, finished with hand-brushed gold leaf.',
      calories: '480 kcal',
      pairing: '10-Year Tawny Port',
      chefNote: 'The bitterness of the dark chocolate keeps the caramel from being cloying.',
      technique: 'Chocolate tempering & molding',
    },
    {
      id: 'des-2',
      name: 'Deconstructed Meyer Lemon Tart',
      price: '$20',
      ingredients: 'Meyer lemon curd, toasted Italian meringue peaks, graham cracker dust, lavender gel',
      recommendation: 'Spoon all components together to get the balance of sweet, tart, and floral.',
      prepStory: 'Lemon curd whipped with cold butter to achieve a velvet-like density.',
      calories: '290 kcal',
      pairing: "Moscato d'Asti",
      chefNote: 'Lavender highlights the citrus notes without overpowering the palate.',
      technique: 'Emulsion whipping & meringue piping',
    },
    {
      id: 'des-3',
      name: 'Grand Marnier Soufflé',
      price: '$26',
      ingredients: 'Airy soufflé batter, orange zest infusion, vanilla bean crème anglaise',
      recommendation: 'Allow the server to pierce the soufflé and pour in the cream.',
      prepStory: 'Baked to order in copper ramekins, timed down to the second for the perfect rise.',
      calories: '350 kcal',
      pairing: 'Cointreau or Grand Marnier Neat',
      chefNote: 'A French classic, requiring precise folding techniques to keep its lift.',
      technique: 'Air-folding & high-heat baking',
    },
  ],
  Drinks: [
    {
      id: 'dr-1',
      name: 'Smoked Sage Old Fashioned',
      price: '$28',
      ingredients: 'Aged Kentucky bourbon, angostura bitters, maple syrup, smoke-infused sage leaf',
      recommendation: 'Inhale the smoked sage aroma before taking your first sip.',
      video: '/videos/cocktail.mp4',
      prepStory: 'Smoked inside a glass cloche with wild white sage right before serving.',
      calories: '150 kcal',
      pairing: 'Single Estate Cigar',
      chefNote: 'Maple syrup provides a softer, rounder sweetness than sugar cubes.',
      technique: 'Cloche wood-smoking',
    },
    {
      id: 'dr-2',
      name: 'Royal Saffron Elixir',
      price: '$24',
      ingredients: 'Persian saffron syrup, fresh lime juice, sparkling water, gold-dusted rose petals',
      recommendation: 'Stir slowly to release the saffron fragrance.',
      prepStory: 'Saffron threads steeped for 24 hours at room temperature to extract pure color.',
      calories: '90 kcal',
      pairing: 'Mocktail (Non-alcoholic)',
      chefNote: 'A fragrant, luxurious refresher that cleanses the palate.',
      technique: 'Infusion extraction',
    },
    {
      id: 'dr-3',
      name: 'Vintage Krug Collection',
      price: '$450',
      ingredients: '100% Champagne grape blend, exceptional vintage selection',
      recommendation: 'Savor raw oysters or Wagyu tartare alongside this Champagne.',
      prepStory: 'Aged for over 12 years in Krug cellar vaults under strict humidity control.',
      calories: '120 kcal',
      pairing: 'Caviar Service',
      chefNote: 'One of the most complex, toast-forward Champagnes in existence.',
      technique: 'Traditional method secondary fermentation',
    },
  ],
};

const categories = ['Starters', 'Signature', 'Seafood', 'Desserts', 'Drinks'];

export default function InteractiveMenu() {
  const [activeCategory, setActiveCategory] = useState('Starters');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Auto collapse cards on category change
  useEffect(() => {
    setExpandedCardId(null);
  }, [activeCategory]);

  return (
    <section id="menu" className="relative bg-[#0D0D0D] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[100dvh]">
      <AmbientParticles className="absolute inset-0 z-0 pointer-events-none opacity-25" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
          The Menu
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Signature Creations
        </h2>
        <div className="w-[60px] h-[1px] bg-[#D4AF37] mx-auto mt-6" />
      </div>

      {/* Categories Bar */}
      <div className="relative z-10 max-w-2xl mx-auto mb-16 flex flex-wrap justify-center gap-2 sm:gap-4 border-b border-white/5 pb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-6 py-2 font-sans text-xs uppercase tracking-widest text-[#B5B5B5] hover:text-[#D4AF37] transition-colors focus:outline-none"
            >
              <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[#0D0D0D] font-medium' : ''}`}>
                {cat}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#D4AF37] rounded-full z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {menuData[activeCategory].map((item) => {
              const isExpanded = expandedCardId === item.id;
              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedCardId(isExpanded ? null : item.id)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// Menu Card Component
interface MenuCardProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function MenuCard({ item, isExpanded, onToggle }: MenuCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Desktop hover trigger and Mobile tap trigger
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      onToggle();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      onToggle();
    }
  };

  const handleTap = () => {
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card w-full h-[520px] rounded-xl overflow-hidden relative flex flex-col justify-between group cursor-pointer transition-colors duration-500 border border-white/5 hover:border-[#D4AF37]/30"
      style={{
        boxShadow: isExpanded ? '0 0 30px rgba(212, 175, 55, 0.1)' : 'none',
      }}
    >
      {/* Media Layer (60% Height) */}
      <div className="h-[60%] w-full relative overflow-hidden">
        {item.video ? (
          <LazyVideo src={item.video} />
        ) : (
          <PremiumPlaceholder name={item.name} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent to-20%" />
      </div>

      {/* Content Layer (40% Height) */}
      <div className="h-[40%] bg-[#171717] p-6 flex flex-col justify-between relative">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-xl md:text-2xl font-light text-white leading-tight">
              {item.name}
            </h3>
            <span className="font-sans text-lg text-[#D4AF37] font-light shrink-0">
              {item.price}
            </span>
          </div>
          <p className="font-sans text-xs text-[#B5B5B5] leading-relaxed line-clamp-2">
            {item.ingredients}
          </p>
        </div>

        {/* Chef recommendation footer */}
        <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]/80 italic pt-3 border-t border-white/5">
          <Sparkles size={12} className="shrink-0 text-[#D4AF37]" />
          <span className="line-clamp-1">{item.recommendation}</span>
        </div>

        {/* Immersive details drawer sliding absolutely inside card (causes NO reflows) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-0 bg-[#171717]/95 p-6 flex flex-col justify-between z-10 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl"
            >
              {/* Drawer Content */}
              <div data-lenis-prevent className="space-y-4 overflow-y-auto pr-1">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-3">
                  <h4 className="font-serif text-lg text-white font-light uppercase tracking-wider">
                    Culinary Insights
                  </h4>
                  <span className="font-sans text-xs text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                    {item.calories}
                  </span>
                </div>

                {/* Body Details */}
                <div className="space-y-3 font-sans">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-medium block">
                      Preparation & Technique
                    </span>
                    <p className="text-xs text-[#B5B5B5] leading-relaxed">
                      <span className="text-white font-medium">{item.technique}: </span>
                      {item.prepStory}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-medium block">
                      Chef's Note
                    </span>
                    <p className="text-xs text-[#B5B5B5] leading-relaxed italic">
                      "{item.chefNote}"
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5 flex items-start gap-2">
                    <Wine size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-medium block">
                        Sommelier Wine Pairing
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed font-light">
                        {item.pairing}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Close Helper for Mobile */}
              <div className="lg:hidden text-center text-[10px] text-[#B5B5B5]/50 uppercase tracking-widest pt-2 border-t border-white/5 flex items-center justify-center gap-1.5">
                <Info size={10} /> Tap anywhere to collapse
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
