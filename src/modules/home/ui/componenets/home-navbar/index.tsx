import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchInput } from "./search-input";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/conponents/auth-button";

export const HomeNavbar =()=>{
    return(
        <nav className="fixed top-0  left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                {/* Menu and Logo */}
                <div className="flex items-center flex-shrink-0">
                {/* flex-shrink-0: 해상도와 상관 없이 절대 축소되지 않음 */}
                    <SidebarTrigger />
                    <Link href="/">
                    <div className="p-4 flex items-center gap-1">
                        <Image src="/logo.svg" alt="logo" width={30} height={30}/>
                        <p className="text-xl font-semibold tracking-tight">OurTube</p>
                    </div>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 justify-center max-w-[720px] mx-auto">
                    <SearchInput/>
                </div>
                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton/>
                </div>
            </div>
        </nav>
    );
};