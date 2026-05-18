export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  ingredients?: string;
  stock: number;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const categories = [
  "Skincare",
  "Makeup",
  "Fragrance",
  "Haircare",
  "Wellness",
  "Bath & Body",
];

export const brands = [
  "Velora",
  "Lumière",
  "Aurae",
  "Botanica",
  "Noir",
  "Pure&Co",
];

export const products: Product[] = [
  { id: "p1", name: "Radiance Vitamin C Serum", category: "Skincare", brand: "Velora", price: 1299, originalPrice: 1899, rating: 4.6, image: img("photo-1556228720-195a672e8a03"), description: "Brightening 15% Vitamin C serum that fades dark spots and boosts glow.", ingredients: "Vitamin C, Hyaluronic Acid, Vitamin E", stock: 24, trending: true, bestSeller: true },
  { id: "p2", name: "Hydra Glow Moisturizer", category: "Skincare", brand: "Lumière", price: 899, originalPrice: 1299, rating: 4.4, image: img("photo-1570194065650-d99fb4bedf0a"), description: "Lightweight gel cream with hyaluronic acid for 72-hour hydration.", ingredients: "Hyaluronic Acid, Niacinamide, Squalane", stock: 40, bestSeller: true },
  { id: "p3", name: "Matte Velvet Lipstick", category: "Makeup", brand: "Noir", price: 499, originalPrice: 699, rating: 4.7, image: img("photo-1586495777744-4413f21062fa"), description: "Long-wear matte lipstick with a velvety finish in 12 shades.", stock: 80, trending: true },
  { id: "p4", name: "Silk Foundation SPF 30", category: "Makeup", brand: "Lumière", price: 1599, originalPrice: 1999, rating: 4.5, image: img("photo-1631730486572-226d1f595b68"), description: "Buildable medium coverage foundation with broad-spectrum SPF 30.", stock: 30, newArrival: true },
  { id: "p5", name: "Rose Oud Eau de Parfum", category: "Fragrance", brand: "Aurae", price: 2499, originalPrice: 3299, rating: 4.8, image: img("photo-1541643600914-78b084683601"), description: "Warm, floral oud with notes of rose, amber, and Bulgarian musk.", stock: 15, bestSeller: true, trending: true },
  { id: "p6", name: "Citrus Bloom Body Mist", category: "Fragrance", brand: "Botanica", price: 599, originalPrice: 899, rating: 4.2, image: img("photo-1592945403244-b3fbafd7f539"), description: "Refreshing all-day body mist with bergamot and white florals.", stock: 60 },
  { id: "p7", name: "Argan Repair Hair Oil", category: "Haircare", brand: "Botanica", price: 749, originalPrice: 999, rating: 4.5, image: img("photo-1535585209827-a15fcdbc4c2d"), description: "Cold-pressed Moroccan argan oil for shine, strength, and frizz control.", stock: 50, newArrival: true },
  { id: "p8", name: "Volume Boost Shampoo", category: "Haircare", brand: "Pure&Co", price: 449, originalPrice: 599, rating: 4.3, image: img("photo-1535732759880-bbd5c7265e3f"), description: "Sulfate-free shampoo for fine, limp hair. Adds lift and bounce.", stock: 70 },
  { id: "p9", name: "Calm Mind Sleep Drops", category: "Wellness", brand: "Pure&Co", price: 899, originalPrice: 1199, rating: 4.6, image: img("photo-1556228578-8c89e6adf883"), description: "Plant-based melatonin and ashwagandha sleep support.", stock: 35, trending: true },
  { id: "p10", name: "Daily Multivitamin", category: "Wellness", brand: "Pure&Co", price: 699, originalPrice: 899, rating: 4.4, image: img("photo-1584308666744-24d5c474f2ae"), description: "30-day supply, women's daily essential vitamins and minerals.", stock: 100 },
  { id: "p11", name: "Coconut Milk Body Wash", category: "Bath & Body", brand: "Botanica", price: 399, originalPrice: 549, rating: 4.3, image: img("photo-1556228852-80b6e5eeff06"), description: "Creamy, sulfate-free body wash with coconut and shea.", stock: 90 },
  { id: "p12", name: "Lavender Bath Salts", category: "Bath & Body", brand: "Aurae", price: 549, originalPrice: 749, rating: 4.5, image: img("photo-1570194065650-d99fb4bedf0a"), description: "Epsom and pink Himalayan salts infused with French lavender.", stock: 45, bestSeller: true },
  { id: "p13", name: "Retinol Renewal Night Cream", category: "Skincare", brand: "Velora", price: 1799, originalPrice: 2499, rating: 4.7, image: img("photo-1620916566398-39f1143ab7be"), description: "Encapsulated retinol cream that smooths fine lines overnight.", stock: 20, newArrival: true },
  { id: "p14", name: "Glow Drop Highlighter", category: "Makeup", brand: "Noir", price: 699, originalPrice: 999, rating: 4.6, image: img("photo-1599733589046-833caccbbd03"), description: "Liquid highlighter for a lit-from-within glow.", stock: 55 },
  { id: "p15", name: "Sandalwood Cologne", category: "Fragrance", brand: "Aurae", price: 1899, originalPrice: 2499, rating: 4.5, image: img("photo-1594035910387-fea47794261f"), description: "Earthy sandalwood with cedar and vetiver base.", stock: 18 },
  { id: "p16", name: "Curl Defining Cream", category: "Haircare", brand: "Botanica", price: 599, originalPrice: 799, rating: 4.4, image: img("photo-1522338242992-e1a54906a8da"), description: "Frizz-free curl definition with flaxseed and aloe.", stock: 40 },
  { id: "p17", name: "Collagen Beauty Powder", category: "Wellness", brand: "Pure&Co", price: 1499, originalPrice: 1999, rating: 4.6, image: img("photo-1610725663727-08695a1ac3d9"), description: "Marine collagen peptides for skin, hair, and nail support.", stock: 25, bestSeller: true },
  { id: "p18", name: "Sugar Scrub Polish", category: "Bath & Body", brand: "Velora", price: 649, originalPrice: 849, rating: 4.5, image: img("photo-1608248543803-ba4f8c70ae0b"), description: "Exfoliating sugar scrub with sweet almond oil.", stock: 60 },
  { id: "p19", name: "Eye Brightening Cream", category: "Skincare", brand: "Lumière", price: 1099, originalPrice: 1499, rating: 4.3, image: img("photo-1631730359585-38a4935cbec4"), description: "Caffeine + peptide eye cream that depuffs and brightens.", stock: 30, newArrival: true },
  { id: "p20", name: "Bold Liner Pen", category: "Makeup", brand: "Noir", price: 399, originalPrice: 549, rating: 4.7, image: img("photo-1583241800698-9c2e8d8b89e2"), description: "Ultra-pigmented felt-tip eyeliner with 18-hour wear.", stock: 75, trending: true },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const similarProducts = (id: string, category: string) =>
  products.filter((p) => p.id !== id && p.category === category).slice(0, 4);