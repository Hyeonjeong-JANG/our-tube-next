import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "../componenets/home-navbar";
import { HomeSidebar } from "../componenets/home-sidebar";

interface HomeLayoutProps {
  children: React.ReactNode;
};

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
        <div className="w-full">
            <HomeNavbar />
            <div className="flex min-h-screen pt-[4rem]">
                {/* homenavbar의 높이가 64픽셀이라 그만큼 패딩탑을 주어서 컨텐츠가 잘리지 않고 보이게 하는 것이다. */}
                <HomeSidebar/>
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
};
