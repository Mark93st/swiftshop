import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- 🔍 Starting Database Diagnostics ---');

  // 1. Check for Products without Categories
  const productsWithoutCategory = await prisma.product.count({
    where: { categoryId: null }
  });
  console.log(`- Products without category: ${productsWithoutCategory}`);

  // 2. Check for Orders without Items
  const ordersWithoutItems = await prisma.order.findMany({
    where: { orderItems: { none: {} } },
    select: { id: true, createdAt: true }
  });
  console.log(`- Orders with zero items: ${ordersWithoutItems.length}`);
  if (ordersWithoutItems.length > 0) {
    console.log('  IDs:', ordersWithoutItems.map(o => o.id));
  }

  // 3. Check for Items with zero quantity or price
  const invalidItems = await prisma.orderItem.count({
    where: {
      OR: [
        { quantity: { lte: 0 } },
        { priceAtPurchase: { lte: 0 } }
      ]
    }
  });
  console.log(`- Invalid OrderItems (0 qty or price): ${invalidItems}`);

  // 4. Check User counts and suspicious values
  const userCount = await prisma.user.count();
  const inactiveUsers = await prisma.user.count({ where: { isActive: false } });
  console.log(`- Total Users: ${userCount} (${inactiveUsers} suspended)`);

  // 5. Check for null or weird prices in Products
  const invalidProducts = await prisma.product.count({
    where: {
      OR: [
        { price: { lte: 0 } },
        { stock: { lt: 0 } }
      ]
    }
  });
  console.log(`- Products with invalid price/stock (<= 0): ${invalidProducts}`);

  console.log('--- 🏁 Diagnostics Complete ---');
}

main()
  .catch((e) => {
    console.error('❌ Error during diagnostics:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
