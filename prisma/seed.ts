import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ratnagiri.com" },
    update: {},
    create: {
      email: "admin@ratnagiri.com",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Admin user created: admin@ratnagiri.com / admin123");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "temple-jewelry" },
      update: {},
      create: {
        title: "Temple Jewelry",
        slug: "temple-jewelry",
        description: "Sacred ornamentation inspired by South Indian temple architecture and divine iconography.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "kundan-jewelry" },
      update: {},
      create: {
        title: "Kundan Jewelry",
        slug: "kundan-jewelry",
        description: "The art of setting uncut diamonds and precious stones in gold foil — a Mughal legacy.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "jadau-jewelry" },
      update: {},
      create: {
        title: "Jadau Jewelry",
        slug: "jadau-jewelry",
        description: "Mughal-era craft combining Kundan settings with Meenakari enameling.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "silver-jewelry" },
      update: {},
      create: {
        title: "Silver Jewelry",
        slug: "silver-jewelry",
        description: "Sterling silver jewelry with intricate filigree and tribal motifs.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "brass-jewelry" },
      update: {},
      create: {
        title: "Brass Jewelry",
        slug: "brass-jewelry",
        description: "Bold, earthy, tribal-inspired brass statement pieces.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gemstone-jewelry" },
      update: {},
      create: {
        title: "Gemstone Jewelry",
        slug: "gemstone-jewelry",
        description: "Precious and semi-precious gemstones set in gold and silver.",
      },
    }),
  ]);
  console.log(`${categories.length} categories created`);

  // Create collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: "royal-bridal-collection" },
      update: {},
      create: {
        title: "Royal Bridal Collection",
        slug: "royal-bridal-collection",
        description: "Curated for the modern bride who honors tradition. Our bridal collection features the finest Kundan, Jadau, and Temple jewelry, each piece handcrafted to become a family heirloom.",
      },
    }),
    prisma.collection.upsert({
      where: { slug: "everyday-elegance" },
      update: {},
      create: {
        title: "Everyday Elegance",
        slug: "everyday-elegance",
        description: "Delicate silver and gemstone pieces designed for daily wear. Timeless designs that transition effortlessly from work to evening.",
      },
    }),
  ]);
  console.log(`${collections.length} collections created`);

  // Create products
  const products = [
    { title: "Lakshmi Temple Pendant Necklace", slug: "lakshmi-temple-pendant-necklace", price: 28900, discountPrice: 24500, craftType: "Handcrafted", materials: ["22ct Gold", "Ruby", "Emerald"], occasion: ["Wedding", "Festival"], stockStatus: "In Stock", featured: true, categorySlug: "temple-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Royal Kundan Bridal Set", slug: "royal-kundan-bridal-set", price: 185000, discountPrice: 157000, craftType: "Kundan Setting", materials: ["24ct Gold", "Uncut Diamonds", "Emerald"], occasion: ["Wedding"], stockStatus: "Limited Stock", featured: true, categorySlug: "kundan-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Meenakari Jadau Jhumka Earrings", slug: "meenakari-jadau-jhumka-earrings", price: 45000, discountPrice: 38000, craftType: "Jadau Setting", materials: ["22ct Gold", "Polki Diamonds", "Meenakari Enamel"], occasion: ["Wedding", "Festival", "Party"], stockStatus: "In Stock", featured: true, categorySlug: "jadau-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Tribal Silver Cuff Bracelet", slug: "tribal-silver-cuff-bracelet", price: 8900, craftType: "Hand-carved", materials: ["Sterling Silver"], occasion: ["Daily Wear", "Casual"], stockStatus: "In Stock", featured: true, categorySlug: "silver-jewelry", collectionSlug: "everyday-elegance" },
    { title: "Rainbow Moonstone Pendant", slug: "rainbow-moonstone-pendant-necklace", price: 12500, discountPrice: 10600, craftType: "Filigree", materials: ["Sterling Silver", "Moonstone"], occasion: ["Daily Wear", "Office"], stockStatus: "In Stock", featured: true, categorySlug: "gemstone-jewelry", collectionSlug: "everyday-elegance" },
    { title: "Grand Temple Matha Patti", slug: "grand-temple-matha-patti", price: 42000, discountPrice: 35700, craftType: "Handcrafted", materials: ["22ct Gold", "Emerald", "Ruby"], occasion: ["Wedding"], stockStatus: "Limited Stock", featured: true, categorySlug: "temple-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Antique Kundan Choker", slug: "antique-kundan-choker", price: 78000, discountPrice: 66000, craftType: "Kundan Setting", materials: ["22ct Gold", "Polki Diamonds", "Ruby"], occasion: ["Wedding", "Festival"], stockStatus: "In Stock", featured: false, categorySlug: "kundan-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Silver Filigree Earrings", slug: "silver-filigree-earrings", price: 3400, craftType: "Filigree", materials: ["Sterling Silver"], occasion: ["Daily Wear", "Office"], stockStatus: "In Stock", featured: false, categorySlug: "silver-jewelry", collectionSlug: "everyday-elegance" },
    { title: "Brass Tribal Necklace", slug: "brass-tribal-necklace", price: 2800, craftType: "Handcrafted", materials: ["Brass", "Bone Beads"], occasion: ["Casual", "Boho"], stockStatus: "In Stock", featured: false, categorySlug: "brass-jewelry", collectionSlug: "everyday-elegance" },
    { title: "Emerald Stud Earrings", slug: "emerald-stud-earrings", price: 18500, discountPrice: 15700, craftType: "Stone Setting", materials: ["18ct Gold", "Emerald"], occasion: ["Daily Wear", "Office", "Party"], stockStatus: "Pre-order", featured: false, categorySlug: "gemstone-jewelry", collectionSlug: "everyday-elegance" },
    { title: "Jadau Bridal Maang Tikka", slug: "jadau-bridal-maang-tikka", price: 52500, discountPrice: 44500, craftType: "Jadau Setting", materials: ["22ct Gold", "Polki", "Meenakari"], occasion: ["Wedding"], stockStatus: "In Stock", featured: false, categorySlug: "jadau-jewelry", collectionSlug: "royal-bridal-collection" },
    { title: "Temple Bell Pendant Necklace", slug: "temple-bell-pendant-necklace", price: 16500, craftType: "Handcrafted", materials: ["22ct Gold", "Ruby"], occasion: ["Festival", "Daily Wear"], stockStatus: "In Stock", featured: false, categorySlug: "temple-jewelry", collectionSlug: "royal-bridal-collection" },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    const collection = collections.find((c) => c.slug === p.collectionSlug);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        price: p.price,
        discountPrice: p.discountPrice || null,
        craftType: p.craftType,
        materials: p.materials,
        occasion: p.occasion,
        stockStatus: p.stockStatus,
        featured: p.featured,
        categoryId: category?.id || null,
        collectionId: collection?.id || null,
        images: [],
      },
    });
  }
  console.log(`${products.length} products created`);

  // Create blog posts
  const posts = [
    {
      title: "The Art of Temple Jewelry: A Divine Tradition",
      slug: "art-of-temple-jewelry",
      excerpt: "Temple jewelry is more than ornamentation — it is a sacred art form that has adorned deities and dancers in South Indian temples for centuries. Explore the divine craft that continues to inspire Ratnagiri's master artisans.",
      content: "## The Sacred Origins\n\nTemple jewelry, or 'Temple Jewellery' as it is traditionally known, originated in the temples of South India during the Chola dynasty (9th-13th centuries). These pieces were not merely decorative — they were created to adorn the deities during festivals and ceremonies.\n\n## The Craftsmanship\n\nEach piece of temple jewelry is a testament to the goldsmith's art. Using the ancient technique of wax casting, artisans create intricate designs featuring gods, goddesses, and sacred symbols. The most recognizable motifs include:\n\n- **Lakshmi** — the goddess of wealth and prosperity\n- **Gajalakshmi** — Lakshmi flanked by elephants\n- **Peacocks** — symbols of grace and beauty\n- **Temple gopurams** — architectural motifs inspired by temple towers\n\n## A Living Tradition\n\nAt Ratnagiri, we work with master craftspeople in the temple towns of Tamil Nadu and Karnataka who have inherited this tradition through generations. Each piece carries the blessings of centuries of devotion.",
      coverImage: "",
      author: "Ratnagiri Heritage Team",
      tags: ["temple jewelry", "craftsmanship", "tradition"],
    },
    {
      title: "Kundan & Jadau: The Mughal Legacy of Indian Jewelry",
      slug: "kundan-jadau-mughal-legacy",
      excerpt: "The exquisite techniques of Kundan setting and Jadau work represent the pinnacle of Mughal-era jewelry craftsmanship. Discover how these ancient arts create pieces of unparalleled beauty.",
      content: "## The Mughal Influence\n\nThe Mughal emperors brought with them a tradition of jewelry craftsmanship that would forever transform Indian adornment. The techniques of Kundan (setting uncut gems in pure gold) and Jadau (combining Kundan with enamel work) reached their zenith in the royal courts of Rajasthan and Gujarat.\n\n## What Makes Kundan Unique\n\nUnlike modern gem setting where stones are held by prongs, Kundan uses pure gold foil to encase each stone. The gold is so pure (24ct) that it is malleable enough to be shaped around the contours of each gem, creating a seamless bed of precious stones.\n\n## The Jadau Process\n\nJadau involves three master artisans working in sequence:\n\n1. **The Ghaaria** — who creates the gold framework\n2. **The Kundansaz** — who sets the stones\n3. **The Meenakar** — who applies the colored enamel\n\nThis collaboration can take months for a single bridal set, but the result is unsurpassed in beauty.",
      coverImage: "",
      author: "Ratnagiri Heritage Team",
      tags: ["kundan", "jadau", "mughal", "bridal"],
    },
    {
      title: "Silver Filigree: The Delicate Art of Oxidized Jewelry",
      slug: "silver-filigree-oxidized-jewelry",
      excerpt: "From the silver artisans of Odisha and West Bengal comes the breathtaking art of filigree — where silver is drawn into threads as fine as hair and woven into intricate patterns.",
      content: "## The Art of Filigree\n\nFiligree, known as 'Tarakasi' in Odisha, is one of the most delicate forms of silver craftsmanship. Artisans draw sterling silver into hair-thin wires, then twist, curl, and solder them into intricate patterns that seem to float in air.\n\n## History & Heritage\n\nSilver filigree has been practiced in India for over 2,000 years. The ancient city of Cuttack in Odisha is famous for its filigree work, where entire bazaars are dedicated to this craft. The technique was also perfected in Karimnagar (Telangana) and Bengal.\n\n## Why Choose Silver\n\nSilver jewelry offers:\n- **Affordability** — beautiful craftsmanship at accessible prices\n- **Versatility** — pairs with both traditional and modern attire\n- **Oxidization** — the blackened finish that highlights intricate patterns\n- **Hypoallergenic** — ideal for sensitive skin\n\nAt Ratnagiri, our silver collection ranges from delicate daily-wear pieces to statement tribal designs that celebrate India's diverse silver traditions.",
      coverImage: "",
      author: "Ratnagiri Heritage Team",
      tags: ["silver", "filigree", "oxidized jewelry", "craftsmanship"],
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: new Date(),
        tags: post.tags,
      },
    });
  }
  console.log(`${posts.length} blog posts created`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
