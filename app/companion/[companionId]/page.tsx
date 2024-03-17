import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import { CompanionForm } from "./components/CompanionForm";

interface CompanionIdPageProps {
    params: {
        companionId: string;
    }
}

const CompanionIdPage = async ({params}: CompanionIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const companion = await prismadb.companion.findUnique({
        where: {
            userId,
            id: params.companionId
        }
    });

    const categories = await prismadb.category.findMany();

    return ( 
        <CompanionForm 
            companion={companion} 
            categories={categories} />
    );
}
 
export default CompanionIdPage;