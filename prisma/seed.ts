import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Start seeding 1000 products with diverse images...')

  // 1. Clean the database
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Categories
  const categoriesData = [
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Footwear', slug: 'footwear' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Home & Living', slug: 'home-living' },
    { name: 'Beauty', slug: 'beauty' },
  ]

  const createdCategories = await Promise.all(
    categoriesData.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  )

  const categoryImages: Record<string, string[]> = {
    'clothing': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
    ],
    'electronics': [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1491933314544-5843130596d9',
    ],
    'footwear': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1560769629-975e13b51651',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    ],
    'accessories': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a1b',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    ],
    'home-living': [
      'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
      'https://images.unsplash.com/photo-1503602642458-232111445657',
    ],
    'beauty': [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03',
      'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
    ]
  }

  const productNames: Record<string, string[]> = {
    'clothing': ['T-Shirt', 'Jacket', 'Hoodie', 'Pants', 'Dress', 'Sweater'],
    'electronics': ['Headphones', 'Speaker', 'Watch', 'Camera', 'Keyboard', 'Mouse'],
    'footwear': ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Running Shoes'],
    'accessories': ['Backpack', 'Wallet', 'Belt', 'Sunglasses', 'Cap', 'Scarf'],
    'home-living': ['Lamp', 'Cushion', 'Vase', 'Blanket', 'Desk Organizer', 'Clock'],
    'beauty': ['Serum', 'Moisturizer', 'Cleanser', 'Perfume', 'Face Mask'],
  }

  const prefixes = ['Ultra', 'Smart', 'Luxury', 'Essential', 'Classic', 'Vintage', 'Modern', 'Minimalist', 'Urban', 'Nordic']

  const productsToCreate = []

  for (let i = 1; i <= 1000; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const names = productNames[category.slug as string]
    const baseName = names[Math.floor(Math.random() * names.length)]
    
    const name = `${prefix} ${baseName} ${i}`
    const price = parseFloat((Math.random() * (500 - 10) + 10).toFixed(2))
    const stock = Math.floor(Math.random() * 200)
    
    const imgs = categoryImages[category.slug as string]
    const baseImg = imgs[Math.floor(Math.random() * imgs.length)]

    productsToCreate.push({
      name,
      description: `This ${name} is a top-tier product in our ${category.name} collection. Experience the perfect blend of quality and value.`,
      price,
      stock,
      imageUrl: `${baseImg}?q=80&w=1000&auto=format&fit=crop`,
      categoryId: category.id
    })

    if (productsToCreate.length === 100) {
      await prisma.product.createMany({ data: productsToCreate })
      productsToCreate.length = 0
      console.log(`📦 Created ${i} products...`)
    }
  }

  // Final Admin and Users
  const hashedPassword = await bcrypt.hash('password123', 10)
  const createdUsers = await Promise.all([
    prisma.user.create({ data: { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'USER' } }),
    prisma.user.create({ data: { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, role: 'USER' } }),
    prisma.user.create({ data: { name: 'Super Admin', email: 'admin@swiftshop.com', password: await bcrypt.hash('adminpassword123', 10), role: 'ADMIN' } })
  ])

  console.log('✅ Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
