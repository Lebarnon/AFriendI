import { CompanionsCarousel } from "@/components/companionsCarousel";
import prismadb from "@/lib/prismadb";

interface RootPageProps {
    searchParams: {
        categoryId: string;
        name: string;
    }
}

const RootPage = async ({ searchParams }: RootPageProps) => {
    const companions = await prismadb.companion.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: {
                contains: searchParams.name,
                mode: "insensitive"
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    messages: true
                },
            }
        }

    })

    const categories = await prismadb.category.findMany();
    return (
        <div className="h-full p-4 space-y-2">
            <CompanionsCarousel data={companions} />
        </div>
    );
}

export default RootPage;