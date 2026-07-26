import { restaurantConfig } from '@/constants/restaurant';

export const conciergeKnowledge = {
  restaurant: {
    name: restaurantConfig.businessName,
    address: restaurantConfig.address,
    phone: restaurantConfig.phone,
    email: restaurantConfig.email,
    hours: {
      weekday: restaurantConfig.openingHours.weekday.days + ': ' + restaurantConfig.openingHours.weekday.hours,
      weekend: restaurantConfig.openingHours.weekend.days + ': ' + restaurantConfig.openingHours.weekend.hours,
      sunday: restaurantConfig.openingHours.sunday.days + ': ' + restaurantConfig.openingHours.sunday.hours,
      note: 'Reservations are highly recommended. Kitchen closes 45 minutes prior to closing.'
    },
    dressCode: 'Smart Elegant. Gentlemen are recommended to wear jackets. Sportswear, athletic wear, beachwear, and open shoes are not permitted in the dining room.',
    parking: 'Valet parking is available at the main entrance on Culinary Avenue ($40 per vehicle). Self-parking garages are located nearby at 150 Culinary Avenue.',
    policies: {
      cancellation: 'We require 24 hours notice for cancellations. No-shows or cancellations within 24 hours will incur a fee of $50 per guest.',
      gracePeriod: 'Tables are held for a maximum of 15 minutes past the scheduled reservation time.',
      largeParties: `For parties larger than 8 guests, reservations must be arranged through our concierge office or finalized via WhatsApp at ${restaurantConfig.whatsappNumber}.`
    },
    privateDining: {
      capacity: 'Our private dining vault accommodates up to 24 guests.',
      menu: 'Bespoke multi-course chef tasting menus are curated for private events.',
      booking: `Private bookings require a minimum of 14 days notice and can be requested via our reservation form or by emailing ${restaurantConfig.email}.`
    }
  },
  menu: {
    Starters: [
      {
        name: 'Citrus Cured Scallop',
        price: '$32',
        ingredients: 'Hokkaido scallops, blood orange reduction, finger lime, pickled sea fennel, bronze fennel fronds',
        winePairing: 'Chablis Premier Cru',
        chefNote: 'The acidity of the citrus highlights the natural sweetness of the cold-water scallop.',
        technique: 'Acid-curing & cold-pressing',
        calories: '180 kcal'
      },
      {
        name: 'Foie Gras Torchon',
        price: '$38',
        ingredients: 'Hudson Valley foie gras, Sauternes gelee, caramelized fig spread, toasted brioche',
        winePairing: "2018 Chateau d'Yquem Sauternes",
        chefNote: 'Sauternes gelee provides the perfect sweet counterbalance to the rich torchon.',
        technique: 'Torchon slow-poaching',
        calories: '320 kcal'
      },
      {
        name: 'Heritage Heirloom Carpaccio',
        price: '$28',
        ingredients: 'Slow-roasted heirloom tomatoes, aged balsamic caviar, basil crystals, pine nut cream',
        winePairing: 'Vermentino di Sardegna',
        chefNote: 'A vegetarian tribute to Italian carpaccio, bursting with tomato umami.',
        technique: 'Dehydration & spherification',
        calories: '140 kcal'
      }
    ],
    Signature: [
      {
        name: '72-Hour Smoked Duck Confit',
        price: '$72',
        ingredients: 'Slow-rendered heritage duck leg, sour cherry gastrique, roasted mission figs, parsnip puree',
        winePairing: 'Gevrey-Chambertin Pinot Noir',
        chefNote: 'The crisp skin balances the luscious melting texture of the meat.',
        technique: 'Confit & smoke-infusion',
        calories: '620 kcal'
      },
      {
        name: 'Wagyu Ribeye Cap A5',
        price: '$145',
        ingredients: 'Miyazaki A5 Wagyu, charred green garlic, black garlic reduction, smoked sea salt flakes',
        winePairing: '2015 Cabernet Sauvignon Napa Valley',
        chefNote: 'Simple accompaniments honor the pristine quality of this rare cut.',
        technique: 'Binchotan charcoal searing',
        calories: '780 kcal'
      },
      {
        name: 'Truffle Agnolotti',
        price: '$58',
        ingredients: 'Hand-rolled pasta, liquid parmesan filling, shaved Alba white truffle, brown butter emulsion',
        winePairing: 'Barolo Riserva',
        chefNote: 'White truffle needs fat to bloom; the brown butter sauce does exactly that.',
        technique: 'Emulsification & hand-extrusion',
        calories: '450 kcal'
      }
    ],
    Seafood: [
      {
        name: 'Butter Poached Maine Lobster',
        price: '$85',
        ingredients: 'Atlantic lobster tail, saffron butter emulsion, sea asparagus, lemon verbena foam',
        winePairing: 'Puligny-Montrachet Chardonnay',
        chefNote: 'The saffron foam adds a floral, earthy depth to the sweet lobster.',
        technique: 'Sous-vide butter-poaching',
        calories: '380 kcal'
      },
      {
        name: 'Crisp Skin Chilean Sea Bass',
        price: '$64',
        ingredients: 'Wild sea bass, ginger-dashi broth, baby bok choy, toasted sesame oil, ginger glaze',
        winePairing: 'Dry German Riesling Spätlese',
        chefNote: 'The ginger broth cuts through the high fat content of the sea bass.',
        technique: 'Slow pan-searing & reduction',
        calories: '410 kcal'
      },
      {
        name: 'Pan-Seared Diver Scallops',
        price: '$54',
        ingredients: 'Jumbo scallops, sunchoke puree, hazelnut brown butter, crispy pancetta lardons',
        winePairing: 'Meursault Chardonnay',
        chefNote: 'Hazelnuts mimic the nutty notes of seared scallop caramelized crust.',
        technique: 'Plancha high-heat searing',
        calories: '320 kcal'
      }
    ],
    Desserts: [
      {
        name: 'Gold Leaf Chocolate Dome',
        price: '$24',
        ingredients: '72% Valrhona dark chocolate, salted caramel core, hazelnut praline, edible 24k gold leaf',
        winePairing: '10-Year Tawny Port',
        chefNote: 'The bitterness of the dark chocolate keeps the caramel from being cloying.',
        technique: 'Chocolate tempering & molding',
        calories: '480 kcal'
      },
      {
        name: 'Deconstructed Meyer Lemon Tart',
        price: '$20',
        ingredients: 'Meyer lemon curd, toasted Italian meringue peaks, graham cracker dust, lavender gel',
        winePairing: "Moscato d'Asti",
        chefNote: 'Lavender highlights the citrus notes without overpowering the palate.',
        technique: 'Emulsion whipping & meringue piping',
        calories: '290 kcal'
      },
      {
        name: 'Grand Marnier Soufflé',
        price: '$26',
        ingredients: 'Airy soufflé batter, orange zest infusion, vanilla bean crème anglaise',
        winePairing: 'Cointreau or Grand Marnier Neat',
        chefNote: 'A French classic, requiring precise folding techniques to keep its lift.',
        technique: 'Air-folding & high-heat baking',
        calories: '350 kcal'
      }
    ],
    Drinks: [
      {
        name: 'Smoked Sage Old Fashioned',
        price: '$28',
        ingredients: 'Aged Kentucky bourbon, angostura bitters, maple syrup, smoke-infused sage leaf',
        winePairing: 'Single Estate Cigar',
        chefNote: 'Maple syrup provides a softer, rounder sweetness than sugar cubes.',
        technique: 'Cloche wood-smoking',
        calories: '150 kcal'
      },
      {
        name: 'Royal Saffron Elixir',
        price: '$24',
        ingredients: 'Persian saffron syrup, fresh lime juice, sparkling water, gold-dusted rose petals',
        winePairing: 'Mocktail (Non-alcoholic)',
        chefNote: 'A fragrant, luxurious refresher that cleanses the palate.',
        technique: 'Infusion extraction',
        calories: '90 kcal'
      },
      {
        name: 'Vintage Krug Collection',
        price: '$450',
        ingredients: '100% Champagne grape blend, exceptional vintage selection',
        winePairing: 'Caviar Service',
        chefNote: 'One of the most complex, toast-forward Champagnes in existence.',
        technique: 'Traditional method secondary fermentation',
        calories: '120 kcal'
      }
    ]
  }
};
