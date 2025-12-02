import { User, Sun, Moon, LogOut } from "lucide-react";
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
      className="h-10 w-10 rounded-xl bg-primary text-dark-foreground  hover:bg-primary transition-all duration-300 border border-transparent"
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
      navigate("/");
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
          className="h-10 w-10 rounded-xl bg-primary text-onPrimary shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-300 border border-white/10"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1.5 bg-popover/95 backdrop-blur-md border border-border text-popover-foreground shadow-xl rounded-2xl mt-2 animate-in fade-in zoom-in-95 duration-200"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
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
  const [rol, setRol] = useState("");
  const [area, setArea] = useState("");
  const { sesion } = useSesion();
  const usuarioId = sesion.usuarioId

  useEffect(() => {
    const fetchUserData = async () => {

      try {
        const { data } = await api.get(`${axiosConfig.apiUrl}/usuario/${usuarioId}`);
        setUserEmail(data.email);
        setRol(data.rol.nombre);
        setArea(data.area.nombre);
      } catch (error) {
        console.error("Error al obtener datos del usuario o empresa", error);
      }
    };

    fetchUserData();
  }, []);



  return (
    <header className={cn("bg-white dark:bg-gradient-to-br from-gray-900 to-blue-900 backdrop-blur-xl border-b border-border dark:border-blue-500 sticky top-0 z-50 transition-colors duration-300", className)}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo / Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
             <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                5
             </div>
            <div className="hidden sm:block">
              <h1 className="text-foreground dark:text-dark-foreground  text-sm sm:text-base font-bold leading-none tracking-tight">Grupo 5</h1>
              <p className="text-xs text-muted-foreground dark:text-dark-foreground  font-medium leading-none mt-1">Sistema de Reclamos</p>
            </div>
          </div>

          {/* Center Info (Desktop) */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 min-w-0">
            <div className="hidden md:block w-px h-8 bg-border flex-shrink-0" />

            <div className="hidden sm:block flex-shrink-0 text-center">
                <p className="text-sm font-medium text-foreground dark:text-dark-foreground truncate max-w-[150px] md:max-w-none">
                  {userEmail || "Cargando..."}
                </p>
                {rol && <p className="text-xs text-primary font-medium">{rol}</p>}
            </div>

            <div className="hidden md:block w-px h-8 bg-border flex-shrink-0" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <ThemeToggleButton />
            <ProfileButton />
          </div>
        </div>

        {/* Mobile Info Bar */}
        <div className="sm:hidden mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex flex-col min-w-0">
              <p className="font-medium text-foreground truncate">{userEmail || "Usuario"}</p>
              <p className="text-primary truncate opacity-80">{rol+" - "+area}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
