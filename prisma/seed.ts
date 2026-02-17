import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create the 3 blocks: Mist, Breeze, Dew
  const blocks = await Promise.all([
    prisma.block.upsert({
      where: { id: 1 },
      update: {},
      create: { description: 'Mist' }
    }),
    prisma.block.upsert({
      where: { id: 2 },
      update: {},
      create: { description: 'Breeze' }
    }),
    prisma.block.upsert({
      where: { id: 3 },
      update: {},
      create: { description: 'Dew' }
    })
  ])

  console.log('Created blocks:', blocks.map(b => b.description).join(', '))

  // Optional: Create some sample units for each block
  const sampleUnits = []
  for (const block of blocks) {
    for (let i = 1; i <= 5; i++) {
      const unitNumber = String(i).padStart(3, '0')
      sampleUnits.push(
        prisma.unit.upsert({
          where: { id: (block.id - 1) * 5 + i },
          update: {},
          create: {
            description: `${block.description[0]}-${unitNumber}`,
            blockId: block.id,
            sqFt: 1000 + Math.floor(Math.random() * 500)
          }
        })
      )
    }
  }

  const units = await Promise.all(sampleUnits)
  console.log(`Created ${units.length} sample units`)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
