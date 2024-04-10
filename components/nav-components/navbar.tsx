"use client";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/nav-components/mode-toggle";
import { MobileSidebar } from "@/components/nav-components/mobile-sidebar";
import { Companion } from "@prisma/client";
import { SearchInput } from "@/components/search-input";

const font = Poppins({
    weight: "600",
    subsets: ["latin"],
})

interface NavbarProps {
    companions: Companion[];
}

export const Navbar = ({ companions }: NavbarProps) => {
    return (
        <div className="fixed w-full z-50 flex justify-between items-cente py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar companions={companions} />
                <Link href='/'>
                    <div className="flex items-center">
                        <Image
                            src="/afriendi_logo.png"
                            alt="AFriendI Logo"
                            width={50}
                            height={50}
                        />
                        <h1 className={cn(
                            "hidden md:block text-xl md:text-3xl font-bold text-primary",
                            "bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] bg-clip-text text-transparent",

                            font.className
                        )}>
                            AFriendI
                        </h1>
                    </div>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;