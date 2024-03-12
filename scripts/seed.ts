const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    try{
        await db.category.createMany({
            data: [
                { name: "Food" },
                { name: "Clothing" },
                { name: "Electronics" },
                { name: "Books" },
                { name: "Home" },
                { name: "Garden" },
                { name: "Health" },
                { name: "Beauty" },
                { name: "Toys" },
                { name: "Sports" }
            ]
        });
    }catch(error){
        console.error("Error seeding default categories: ", error);
    }finally{
        await db.$disconnect();
    }
}
main()