"use client";

import Image from "next/image"
import { cn } from "@/lib/utils";
import { Companion } from "@prisma/client";
import { Home, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
    companions: Companion[];
}

export const Sidebar = ({companions}: SidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const routes = [
        {
            icon: Home,
            href: "/",
            label: "Home",
            protected: false,
        },
        {
            icon: Plus,
            href: "/companion/new",
            label: "Create",
            protected: true,
        }
    ]
    const onNavigate = (url: string, protectedRoute: boolean) => {
        return router.push(url);
    }
    const onCompanionClick = (companionId: string) => {
        return router.push(`/chat/${companionId}`);
    }

    return ( 
        <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
            <div className="p-3 flex flex-1 justify-center">
                <div className="space-y-2">
                    {routes.map((route, index) => (
                        <div
                        key={route.href}
                        onClick={() => onNavigate(route.href, route.protected)}
                        className={cn(
                            "text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                            pathname === route.href && "bg-primary/10 text-primary")}
                        >
                            <div className="flex flex-col gap-y-2 items-center flex-1">
                                <route.icon className="h-5 w-5"/>
                                {route.label}
                            </div>
                        </div>
                        ))}
                    {companions?.map((companion) => (
                        <div
                        key={companion.id}
                        onClick={() => onCompanionClick(companion.id)}
                        className={cn(
                            "flex p-1 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                            pathname.endsWith(companion.id) && "bg-primary/10 text-primary")}
                        >
                            <Image
                                src={companion.src}
                                alt={companion.name}
                                width={150}
                                height={150}
                                className="rounded-lg"
                            />
                        </div>
                        ))}
                </div>
            </div>
        </div>
     );
}
 
export default Sidebar;