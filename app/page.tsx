import { Categories } from "@/components/categories";
import Companions from "@/components/companions";
import { CompanionsCarousel } from "@/components/companionsCarousel";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

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
            {/* <SearchInput /> */}
            {/* <Categories data={categories} /> */}
            <CompanionsCarousel data={companions} />
            {/* <Companions data={companions} /> */}
        </div>
    );
}

export default RootPage;