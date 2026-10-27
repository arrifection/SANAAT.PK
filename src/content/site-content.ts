// ──────────────────────────────────────────────
// SANAAT — Site Content & Copy
// Restrained, quiet luxury tone
// ──────────────────────────────────────────────

import { CONTACT_INFO, PREORDER_POLICY, SHIPPING_RATES } from './site-config';

export const announcementBarText = 'PRE-ORDERS NOW OPEN · LIMITED PIECES';

export const heroContent = {
  headline: 'FASHION WITH MODESTY',
  subline: 'Thoughtful design and modest elegance — timeless, graceful silhouettes.',
  ctaPrimaryText: 'NEW ARRIVALS',
  ctaPrimaryLink: '/collections/new',
  ctaSecondaryText: 'SHOP THE COLLECTION',
  ctaSecondaryLink: '/shop',
  backgroundUrl:
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=85&auto=format&fit=crop',
} as const;

/** Brand Statement strictly per Section 3.F */
export const brandStatement = {
  heading: 'About Sanaat',
  tagline: 'FASHION WITH MODESTY',
  quote:
    'Sanaat is a celebration of thoughtful design and modest elegance — pieces created to feel timeless, graceful and distinctly your own.',
  description:
    'Rooted in Pakistani heritage and tailored with quiet restraint, each Sanaat piece honors fine craftsmanship, feminine grace, and everyday modesty.',
} as const;

/** About Content for About Page */
export const aboutContent = {
  pageTitle: 'Our Story',
  heroImageUrl:
    'https://images.unsplash.com/photo-1597983073512-ce20e7781138?w=1400&q=80',
  paragraphs: [
    `SANAAT was born from a simple conviction: that the rich textile heritage of Pakistan deserves a place in the modern wardrobe — not as costume, but as considered, everyday luxury. The name itself, drawn from the Urdu word for "craft," is both our identity and our promise.`,
    `Every garment begins with cloth sourced from artisan ateliers across Pakistan — pure cotton lawns, flowing silks, and rich winter velvets selected for drape, hand-feel, and enduring integrity.`,
    `Our design philosophy is deliberate restraint. Silhouettes are clean and modern; embellishments, where they appear, are purposeful — a tonal embroidered neckline, a hand-finished cuff, a single statement border. We believe ornamentation should elevate, never overwhelm.`,
    `SANAAT is for the woman who curates rather than accumulates. She values quality over quantity, story over trend. We are proud to celebrate Pakistani modest fashion on its own terms — contemporary, conscious, and deeply rooted.`,
  ],
  mission: {
    heading: 'Our Mission',
    body: 'To celebrate the textile heritage of Pakistan through modern, wearable design — creating garments that honour modesty, craftsmanship, and feminine grace.',
  },
  values: [
    {
      heading: 'Heritage',
      body: 'Every fabric and technique we use carries generations of South Asian skill and cultural meaning.',
    },
    {
      heading: 'Intention',
      body: 'We design with restraint and purpose — thoughtful silhouettes tailored for modest elegance.',
    },
    {
      heading: 'Quality',
      body: 'From pure textiles to artisan finishing, each stitch meets the quiet standards our customers cherish.',
    },
  ],
} as const;

/** Preorder Banner Content */
export const preorderBannerContent = {
  heading: 'Pre-Orders Now Open',
  body: 'Reserve your handcrafted pieces today. Crafted with meticulous care before dispatch.',
  ctaText: 'VIEW PRE-ORDERS',
  ctaLink: '/shop?preorder=true',
} as const;

/** Editorial Reel Video / Campaign Strip per Section 3.E */
export const editorialStrip = {
  title: 'Editorial Campaign',
  subtitle: 'The Craft of Modest Elegance',
  videoPoster: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85&auto=format&fit=crop',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=85&auto=format&fit=crop',
      title: 'Embroidered Formals',
    },
    {
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85&auto=format&fit=crop',
      title: 'Silk Drapery',
    },
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=85&auto=format&fit=crop',
      title: 'Artisanal Weaves',
    },
    {
      url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85&auto=format&fit=crop',
      title: 'Graceful Silhouettes',
    },
  ],
} as const;

/** Exchange Policy per Section 10 */
export const exchangePolicy = {
  heading: 'Exchanges',
  tagline: 'We want your Sanaat piece to reach you just right.',
  paragraphs: [
    `If your order arrives damaged, contact us on WhatsApp at ${CONTACT_INFO.phoneDisplay}. After the issue is verified, the damaged piece can be returned and Sanaat will arrange a replacement.`,
    'We currently accept exchanges only for damaged products.',
  ],
  whatsappCta: `Contact on WhatsApp (${CONTACT_INFO.phoneDisplay})`,
} as const;

/** Shipping Policy per Section 11 */
export const shippingPolicy = {
  heading: 'Shipping',
  tagline: 'Carefully packed, thoughtfully sent.',
  intro: 'We deliver across Pakistan.',
  rates: [
    { region: 'Punjab', fee: `Rs. ${SHIPPING_RATES.punjab}` },
    { region: 'Outside Punjab (Sindh, KPK, Balochistan, ICT, AJK, GB)', fee: `Rs. ${SHIPPING_RATES.outsidePunjab}` },
  ],
  note: 'Shipping is added automatically at checkout based on your delivery province.',
} as const;

/** Pre-Order Policy per Section 12 */
export const preOrderPolicy = {
  heading: 'Pre-Orders',
  tagline: PREORDER_POLICY.heading,
  notice: `Pre-order pieces take ${PREORDER_POLICY.preparationTime}.`,
  details:
    'Each pre-order piece is made with meticulous care and personal attention. Your order will be carefully packed and dispatched immediately once tailoring and artisan quality inspection are complete.',
} as const;

/** Standard Sanaat Size Chart per Section 7 */
export const defaultSizeChart = {
  title: 'SANAAT Size Chart',
  subtitle: 'All measurements are in inches. Designed with modest, relaxed ease.',
  headers: ['Size', 'Chest / Bust', 'Waist', 'Hips', 'Shirt Length', 'Trouser Length'],
  rows: [
    { size: 'S', chest: '36', waist: '30', hips: '40', shirtLength: '45', trouserLength: '38' },
    { size: 'M', chest: '40', waist: '34', hips: '44', shirtLength: '46', trouserLength: '39' },
    { size: 'L', chest: '44', waist: '38', hips: '48', shirtLength: '47', trouserLength: '39.5' },
    { size: 'XL', chest: '48', waist: '42', hips: '52', shirtLength: '47', trouserLength: '40' },
  ],
  guidelines: [
    'Bust: Measure around the fullest part of your chest, keeping tape comfortably loose.',
    'Waist: Measure around your natural waistline.',
    'Hips: Measure around the fullest part of your hips.',
    'Shirt Length: Measured from the high shoulder point to the hem.',
  ],
} as const;

/** Reusable Description Templates for Admin per Section 17 & 22 */
export const productDescriptionTemplates = [
  {
    id: 'formal-embroidery',
    label: 'Formal Velvet / Raw Silk',
    generate: (_name: string, color: string) =>
      `A graceful three-piece silhouette crafted in pure ${color || 'plum'}. Features delicate tonal hand-embroidery along the neckline and cuffs, paired with a flowing dupatta. Designed for effortless modesty and timeless presence.`,
  },
  {
    id: 'occasion-festive',
    label: 'Occasion Festive Classic',
    generate: (_name: string, color: string) =>
      `An heirloom-inspired formal ensemble in rich ${color || 'ivory gold'}. Accented with refined resham threadwork and subtle artisanal finishings, complemented by an ethereal dupatta. Perfectly suited for intimate gatherings and celebrations.`,
  },
  {
    id: 'summer-edit',
    label: 'Summer Edit Lawn / Cotton',
    generate: (_name: string, color: string) =>
      `Understated elegance for the modern woman. Cut in pure breathable handloom fabric in ${color || 'powder sage'}, featuring minimalist finishings and a relaxed modest drape. An indispensable staple for considered wardrobes.`,
  },
  {
    id: 'contemporary-minimal',
    label: 'Contemporary Minimalist',
    generate: (_name: string, color: string) =>
      `Designed with architectural restraint in ${color || 'charcoal'}. This piece pairs clean silhouettes with purposeful artisan detailing along the borders for quiet sophistication.`,
  },
] as const;

/** Suggested Product Names per Section 17 */
export const suggestedProductNames = [
  'Noor',
  'Mehr',
  'Aira',
  'Elara',
  'Zoya',
  'Meher',
  'Inaya',
  'Aafiya',
] as const;

/** 3 Core Collections per Section 4 */
export const coreCollections = [
  {
    name: 'Winter Formals',
    slug: 'winter-formals',
    description: 'Opulent velvets and rich textures tailored with refined handcraft for winter evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=85&auto=format&fit=crop',
  },
  {
    name: 'Summer Edit',
    slug: 'summer-edit',
    description: 'Airy pure cotton lawns and organza pairings designed for graceful summer modesty.',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85&auto=format&fit=crop',
  },
  {
    name: 'Occasion Wear',
    slug: 'occasion-wear',
    description: 'Heirloom-inspired festive formals featuring delicate resham and tilla handcraft.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85&auto=format&fit=crop',
  },
] as const;
