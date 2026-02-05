// Placeholder data for Nutech Shoe Accessories Marketplace

export type AccessoryType = 'wireless-charger' | 'shoe-tag' | 'mini-sneaker' | 'stickers' | 'skins' | 'laces';

export interface AccessoryItem {
  id: string;
  name: string;
  type: AccessoryType;
  brand: string;
  creator: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export const accessoriesPlaceholderData: AccessoryItem[] = [
  {
    id: 'acc-001',
    name: 'NuCharge Wireless Pad',
    type: 'wireless-charger',
    brand: 'NuTech',
    creator: 'NuTech Labs',
    price: 49.99,
    image: '/assets/generated/accessory-icon-charger.dim_256x256.png',
    description: 'Fast wireless charging pad designed specifically for NuTech smart shoes. Charges your shoe\'s OLED display and sensors in under 2 hours.',
    features: ['15W Fast Charging', 'LED Status Indicator', 'Non-slip Surface', 'USB-C Input'],
    inStock: true,
  },
  {
    id: 'acc-002',
    name: 'NFC Shoe Tag Pro',
    type: 'shoe-tag',
    brand: 'NuTech',
    creator: 'NuTech Labs',
    price: 29.99,
    image: '/assets/generated/accessory-icon-shoe-tag.dim_256x256.png',
    description: 'Smart NFC tag that stores your shoe\'s digital identity and ownership proof. Tap to verify authenticity and access exclusive content.',
    features: ['NFC Enabled', 'Waterproof', 'Tamper-proof', 'Lifetime Warranty'],
    inStock: true,
  },
  {
    id: 'acc-003',
    name: 'Air Jordan Mini Collectible',
    type: 'mini-sneaker',
    brand: 'Jordan',
    creator: 'Sneaker Miniatures Co.',
    price: 79.99,
    image: '/assets/generated/accessory-icon-mini-sneaker.dim_256x256.png',
    description: 'Limited edition 1:6 scale replica of the iconic Air Jordan 1. Perfect for display or as a keychain accessory.',
    features: ['Hand-painted Details', 'Premium Materials', 'Display Stand Included', 'Limited Edition'],
    inStock: true,
  },
  {
    id: 'acc-004',
    name: 'Holographic Sticker Pack',
    type: 'stickers',
    brand: 'NuVerse',
    creator: 'Digital Decals',
    price: 14.99,
    image: '/assets/generated/accessory-icon-stickers.dim_256x256.png',
    description: 'Set of 20 holographic stickers featuring exclusive NuVerse designs. Customize your shoes, laptop, or phone.',
    features: ['20 Unique Designs', 'Waterproof', 'UV Resistant', 'Easy Application'],
    inStock: true,
  },
  {
    id: 'acc-005',
    name: 'Carbon Fiber Skin',
    type: 'skins',
    brand: 'NuTech',
    creator: 'Texture Labs',
    price: 39.99,
    image: '/assets/generated/accessory-icon-skins.dim_256x256.png',
    description: 'Premium carbon fiber textured skin for your NuTech shoes. Adds protection and a sleek, futuristic look.',
    features: ['3M Adhesive', 'Scratch Resistant', 'Easy to Apply', 'Removable'],
    inStock: true,
  },
  {
    id: 'acc-006',
    name: 'Neon Glow Laces',
    type: 'laces',
    brand: 'LaceUp',
    creator: 'Glow Gear',
    price: 19.99,
    image: '/assets/generated/accessory-icon-laces.dim_256x256.png',
    description: 'LED-powered shoelaces that glow in multiple colors. Rechargeable via USB and water-resistant.',
    features: ['7 Color Modes', 'USB Rechargeable', 'Water Resistant', 'Universal Fit'],
    inStock: true,
  },
  {
    id: 'acc-007',
    name: 'Ultra Charge Station',
    type: 'wireless-charger',
    brand: 'NuTech',
    creator: 'NuTech Labs',
    price: 89.99,
    image: '/assets/generated/accessory-icon-charger.dim_256x256.png',
    description: 'Dual charging station for two pairs of smart shoes. Features fast charging and automatic power management.',
    features: ['Dual Charging', '20W Fast Charge', 'Smart Power Management', 'Compact Design'],
    inStock: true,
  },
  {
    id: 'acc-008',
    name: 'Authenticity Tag Elite',
    type: 'shoe-tag',
    brand: 'VerifyTech',
    creator: 'Blockchain Auth',
    price: 49.99,
    image: '/assets/generated/accessory-icon-shoe-tag.dim_256x256.png',
    description: 'Blockchain-verified authenticity tag with QR code and NFC. Proves ownership and tracks shoe history.',
    features: ['Blockchain Verified', 'QR + NFC', 'Ownership History', 'Counterfeit Protection'],
    inStock: false,
  },
  {
    id: 'acc-009',
    name: 'Yeezy Boost Mini',
    type: 'mini-sneaker',
    brand: 'Adidas',
    creator: 'Sneaker Miniatures Co.',
    price: 69.99,
    image: '/assets/generated/accessory-icon-mini-sneaker.dim_256x256.png',
    description: 'Miniature replica of the Yeezy Boost 350. Highly detailed with authentic colorway and materials.',
    features: ['Authentic Colorway', 'Detailed Stitching', 'Keychain Loop', 'Collector\'s Box'],
    inStock: true,
  },
  {
    id: 'acc-010',
    name: 'Metallic Sticker Set',
    type: 'stickers',
    brand: 'NuVerse',
    creator: 'Digital Decals',
    price: 12.99,
    image: '/assets/generated/accessory-icon-stickers.dim_256x256.png',
    description: 'Premium metallic finish stickers with exclusive NuVerse branding. Perfect for personalizing your gear.',
    features: ['15 Metallic Designs', 'Scratch Resistant', 'Premium Finish', 'Weather Proof'],
    inStock: true,
  },
  {
    id: 'acc-011',
    name: 'Leather Texture Skin',
    type: 'skins',
    brand: 'LuxeSkin',
    creator: 'Texture Labs',
    price: 44.99,
    image: '/assets/generated/accessory-icon-skins.dim_256x256.png',
    description: 'Genuine leather-textured protective skin. Adds a premium look and feel to your shoes.',
    features: ['Genuine Leather Texture', 'Premium Adhesive', 'Easy Application', 'Long Lasting'],
    inStock: true,
  },
  {
    id: 'acc-012',
    name: 'Reflective Safety Laces',
    type: 'laces',
    brand: 'SafeStep',
    creator: 'Glow Gear',
    price: 16.99,
    image: '/assets/generated/accessory-icon-laces.dim_256x256.png',
    description: '3M reflective shoelaces for enhanced visibility during night runs. Available in multiple colors.',
    features: ['3M Reflective', 'High Visibility', 'Durable Material', 'Multiple Colors'],
    inStock: true,
  },
];

export const accessoryTypeLabels: Record<AccessoryType, string> = {
  'wireless-charger': 'Wireless Chargers',
  'shoe-tag': 'Shoe Tags',
  'mini-sneaker': 'Mini Sneaker Collectibles',
  'stickers': 'Stickers',
  'skins': 'Skins',
  'laces': 'Laces',
};

export const uniqueBrands = Array.from(new Set(accessoriesPlaceholderData.map(a => a.brand)));
export const uniqueCreators = Array.from(new Set(accessoriesPlaceholderData.map(a => a.creator)));
export const uniqueTypes = Object.keys(accessoryTypeLabels) as AccessoryType[];
