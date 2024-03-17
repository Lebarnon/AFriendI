import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import { Sidebar } from '@/components/nav-components/sidebar';
import { Menu } from 'lucide-react';
import { Companion } from '@prisma/client';


interface MobileSidebarProps {
    companions: Companion[];
}

export const MobileSidebar = ({ companions }: MobileSidebarProps) => {
    return ( 
        <Sheet>
            <SheetTrigger className='md:hidden pr-4'>
                <Menu />
            </SheetTrigger>
            <SheetContent side='left' className='p-0 bg-secondary pt-10 w-32'>
                <Sidebar companions={companions} />
            </SheetContent>
        </Sheet>
     );
}