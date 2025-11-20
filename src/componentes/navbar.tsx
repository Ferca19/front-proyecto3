import { User, Sun, Moon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/DropDownMenu";
import { Button } from "./ui/Button";
import { cn } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "./herramientas/herramientas-visuales/theme-context";
import { useSesion } from "./herramientas/context/SesionContext";
import { api } from "../utils/apiService";
import axiosConfig from "../utils/axiosConfig";


function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 bg-blue-500 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:scale-105 text-white border border-white/20 hover:border-white/40"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}


  function ProfileButton() {
    const navigate = useNavigate();
    const handleLogout = async () => {
    try {
      await api.post(`${axiosConfig.apiUrl}/auth/logout`);
      // Redirigir al login después de cerrar sesión
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-blue-500 rounded-lg transition-all duration-200 hover:bg-blue-900 hover:scale-105 text-white border border-white/20 hover:border-white/40"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg rounded-lg mt-2"
      >
        <DropdownMenuItem
          className="hover:bg-slate-100 text-white dark:hover:bg-slate-700 transition-colors cursor-pointer rounded-md mx-1 my-1"
          onClick={handleLogout}
        >
          <User className="h-4 w-4 mr-2 text-white" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavbarProps {
  className?: string;
}


export function Navbar({ className }: NavbarProps) {
  const [userEmail, setUserEmail] = useState("");
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId

  useEffect(() => {
    const fetchUserData = async () => {

      try {
        const userResponse = await api.get(`${axiosConfig.apiUrl}/usuario/${usuarioId}`);
        setUserEmail(userResponse.data.mail);
      } catch (error) {
        console.error("Error al obtener datos del usuario o empresa", error);
      }
    };

    fetchUserData();
  }, []);



  return (
    <header className={cn("bg-blue-300 dark:bg-dark-sidebar text-sidebarForeground dark:text-dark-sidebarForeground sticky top-0 z-50 shadow-lg border-b border-sidebarBorder dark:border-dark-sidebarBorder", className)}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">

          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="hidden sm:inline">
              <h1 className="text-blue-600 dark:text-blue-500 text-sm sm:text-base md:text-lg font-bold leading-tight">Grupo 5</h1>
              <p className="text-xs text-black dark:text-blue-400 leading-tight">Sistema de Ventas</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 min-w-0">
            <div className="hidden md:block w-px h-10 bg-black dark:bg-blue-700 flex-shrink-0" />

            <div className="hidden sm:block flex-shrink-0">
              <div className="text-xs sm:text-sm">
                <p className="text-black dark:text-blue-400 text-xs truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-black dark:bg-blue-700 flex-shrink-0" />

          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <ThemeToggleButton />
            </div>
            <div className="scale-75 sm:scale-90 md:scale-100">
              <ProfileButton />
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-2 pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex-1 min-w-0">
              <p className="text-black dark:text-blue-400 truncate">{userEmail}</p>            
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
