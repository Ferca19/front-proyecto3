import type React from "react";
import { useState, type ReactNode } from "react";
import { SidebarProvider } from "../componentes/ui/SideBar";
import { Navbar } from "../componentes/navbar";
import { Outlet } from "react-router-dom";
import { SidebarMenus } from "../componentes/sidebarMenus";

interface AdministracionPageProps {
  children?: ReactNode;
}

const AdministracionPage: React.FC<AdministracionPageProps> = () => {
  const [sidebarMenusOpen, setSidebarMenusOpen] = useState(false);

  const openSidebarMenus = () => {
    setSidebarMenusOpen(true);
  };

  const closeSidebarMenus = () => {
    setSidebarMenusOpen(false);
  };

  return (
    <SidebarProvider>
        <div className="w-full flex flex-col h-screen bg-backgroundColor text-foreground">

          <Navbar className="w-full py-1.5" />


          <div className="flex flex-1 min-h-0 overflow-hidden relative">

            <SidebarMenus isOpen={sidebarMenusOpen} onClose={closeSidebarMenus} onOpen={openSidebarMenus} />

            <main
              className={`flex-1 p-4 md:p-6 min-h-0 overflow-auto bg-muted/30 transition-all duration-300 ease-in-out 
            ${sidebarMenusOpen ? "md:ml-80" : ""}
          `}
            >
              <div className="bg-gray-200 p-4 md:p-0 rounded-lg shadow-md dark:bg-gray-900 dark:text-white transition-all duration-300 ease-in-out h-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
    </SidebarProvider>
  );
};

export default AdministracionPage;
