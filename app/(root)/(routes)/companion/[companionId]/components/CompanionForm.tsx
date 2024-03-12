import { Category, Companion } from "@prisma/client";

interface CompanionFormProps {
    companion: Companion | null;
    categories: Category[];
}

export const CompanionForm = ({companion, categories}: CompanionFormProps) => {
    return (
        <div>
            <h1>Companion Form</h1>

        </div>
    )
}