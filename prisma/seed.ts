import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            id: 'cm2jicnzb00001zudwt1j0po8',
            name: 'quickTrader',
            email: 'quicktrader@crypto.com',
            password: '$2a$12$5CwZVBv9Xeh.ZJlqG206lOUv4p6l18eEEhY7SnM/m5evENxkIjw1y',
        },
    })

    console.log(`Created user: ${user.email}`)

    await prisma.investment.createMany({
        data: [
            {
                id: 'cm2jjeeqj000112uddeogwna1',
                stockName: 'Stock A',
                quantity: 10,
                buyPrice: 150,
                currentPrice: 175,
                ownerId: user.id,
            },
            {
                id: 'cm2jjeeqk000212udc7tris2g',
                stockName: 'Stock B',
                quantity: 5,
                buyPrice: 200,
                currentPrice: 190,
                ownerId: user.id,
            },
            {
                id: 'cm2jjeeqk000312udvsy82ik1',
                stockName: 'Mutual Fund',
                quantity: 100,
                buyPrice: 15,
                currentPrice: 16,
                ownerId: user.id,
            },
        ],
    })

    console.log('Investment data seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });