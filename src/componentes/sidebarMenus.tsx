import { useState } from "react";
import {
  ShoppingBag,
  Tag,
  Users,
  ChevronDown,
  ShoppingCart,
  Building,
  Receipt,
  ChartColumnIncreasing,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/Utils";
import { AnimatePresence, motion } from "framer-motion";
import { BotonVertical } from "./ui/BotonVerticalMenu";
import { Rol } from "../interfaces/generales/interfaces-generales";
import { useSesion } from "./herramientas/context/SesionContext";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface MenuItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
  subMenu?: MenuItem[]; // 🔹 Ahora es opcional
}

const { sesion } = useSesion();
const rolId = sesion.rolId;

const menuItems: MenuItem[] = [
  {
    icon: ShoppingCart,
    label: "Gestión Ventas",
    path: "",
    subMenu: [
      { icon: Receipt, label: "Venta", path: "factura-venta" },
      { icon: ChartColumnIncreasing, label: "Estadisticas", path: "estadisticas" },
    ],
  },

  {
    icon: ShoppingBag,
    label: "Gestión Productos",
    path: "",
    subMenu: [
      { icon: Tag, label: "Marca", path: "marca" },
      { icon: ShoppingBag, label: "Producto", path: "producto" },
      { icon: ShoppingBag, label: "Linea", path: "linea" },
    ],
  },

  {
    icon: Users,
    label: "Gestión Usuario",
    path: "",
    subMenu: [{ icon: Users, label: "Usuario", path: "usuario" }],
  },

  {
    icon: Building,
    label: "Organización",
    path: "",
    subMenu: [
      { icon: Users, label: "Cliente", path: "cliente" },
    ],
  },

];



const menuItemsEmpleado: MenuItem[] = [
  {
    icon: ShoppingCart,
    label: "Gestión Ventas",
    path: "",
    subMenu: [
      { icon: Receipt, label: "Venta", path: "factura-venta" },
      { icon: ChartColumnIncreasing, label: "Estadisticas", path: "estadisticas" },
    ],
  },

  {
    icon: ShoppingBag,
    label: "Gestión Productos",
    path: "",
    subMenu: [
      { icon: Tag, label: "Marca", path: "marca" },
      { icon: ShoppingBag, label: "Producto", path: "producto" },
      { icon: ShoppingBag, label: "Linea", path: "linea" },
    ],
  },
  {
    icon: Building,
    label: "Organización",
    path: "",
    subMenu: [
      { icon: Users, label: "Cliente", path: "cliente" },
    ],
  },

];

export function SidebarMenus({ isOpen, onClose, onOpen }: SidebarProps) {
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (label: string, parentPath: string | null = null) => {
    setOpenSubMenus((prev) => {
      const newState = { ...prev };
      if (newState[label]) {
        delete newState[label];
        return newState;
      }
      if (!parentPath) {
        Object.keys(prev).forEach((key) => {
          if (!key.includes("/")) {
            delete newState[key];
          }
        });
      }
      if (parentPath) {
        Object.keys(prev).forEach((key) => {
          if (key.startsWith(parentPath)) {
            newState[key] = prev[key];
          }
        });
      }
      newState[label] = true;
      return newState;
    });
  };

  const renderMenuItems = (items: MenuItem[], level = 0, parentPath: string | null = null) => {
    return items.map((item, index) => {
      const isOpen = !!openSubMenus[item.label];
      const itemPath = parentPath ? `${parentPath}/${item.label}` : item.label;

      return (
        <div key={index} className={level > 0 ? `ml-${level * 3}` : ""}>
          <button
            onClick={() => (item.subMenu ? toggleSubMenu(item.label, parentPath) : navigate(item.path))}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group bg-sidebarAccent dark:bg-dark-sidebarAccent hover:bg-sidebarAccent hover:text-sidebarAccentForeground dark:hover:bg-dark-sidebarAccent dark:hover:text-dark-sidebarAccentForeground",
              level === 0
                ? "text-black dark:text-white bg-blue-200 hover:bg-blue-500 hover:text-white hover:shadow-md dark:hover:bg-blue-500"
                : level === 1
                  ? "bg-blue-200 text-black hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:text-white"
                  : "bg-blue-200 text-black hover:bg-blue-500 hover:text-black dark:hover:bg-blue-500 dark:text-white",
              isOpen && item.subMenu ? "bg-blue-500 text-white hover:text-white dark:bg-blue-500" : "",
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  level === 0 ? 
                  isOpen && item.subMenu ?
                  "text-white dark:text-dark-white" : "text-primary dark:text-dark-primary group-hover:text-white dark:group-hover:text-white"
                  : "text-current",
                )}
              />
              <span
                className={cn(
                  "truncate overflow-hidden whitespace-nowrap transition-all",
                  level === 0 ? "max-w-[140px] font-semibold" : level === 1 ? "max-w-[120px]" : "max-w-[100px]",
                )}
              >
                {item.label}
              </span>
            </div>
            {item.subMenu && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                  level === 0 ? "text-blue-400" : "text-current",
                )}
              />
            )}
          </button>
          <AnimatePresence>
            {item.subMenu && isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1 border-l-2 border-blue-500 dark:border-dark-blue-500 ml-6 pl-2">
                  {renderMenuItems(item.subMenu, level + 1, itemPath)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Botón de toggle mejorado - Siempre visible */}
      <BotonVertical isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {/* Contenedor de la sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320, y: 70 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 250,
              duration: 0.3,
            }}
            className="fixed inset-y-0 left-0 z-40 w-80 md:z-auto"
          >
            {/* Estructura de la sidebar con altura completa - CLAVE: usar flex flex-col */}
            <div className="h-full bg-sidebar dark:bg-dark-sidebar text-sidebarForeground dark:text-dark-sidebarForeground border-r border-sidebarBorder dark:border-dark-sidebarBorder shadow-lg flex flex-col transition-colors duration-300">
              {/* Header fijo (opcional) */}
              <div className="flex-shrink-0 p-4 border-b border-sidebarBorder dark:border-dark-sidebarBorder bg-sidebarAccent/50 dark:bg-dark-sidebarAccent/20 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground tracking-tight">Menús</h2>
                </div>
              </div>

              {/* Contenido scrolleable - CLAVE: usar flex-1 min-h-0 overflow-y-auto */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {renderMenuItems(rolId === Rol.ADMINISTRADOR ? menuItems : menuItemsEmpleado)}
                  {/* Espaciado adicional al final para asegurar que el último elemento sea visible */}
                  <div className="h-4"></div>
                </div>
              </div>

              {/* Footer fijo */}
              <div className="flex-shrink-0 p-4 border-t border-sidebarBorder dark:border-dark-sidebarBorder bg-sidebarAccent/30 dark:bg-dark-sidebarAccent/10 text-xs text-muted dark:text-dark-onMuted">
                <div className="text-center">
                  <p className="text-xs text-gray-500">© 2025 Proyecto 2</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
