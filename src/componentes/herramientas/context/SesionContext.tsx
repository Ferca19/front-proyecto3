import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Sesion } from "../../../interfaces/generales/interfaces-generales";


interface SesionContextType {
  sesion: Sesion;
  setSesionEnContext: (sesion: Sesion) => void;
}

const SesionContext = createContext<SesionContextType | undefined>(undefined);

export const SesionProvider = ({ children }: { children: ReactNode }) => {
  const [sesion, setSesionState] = useState<Sesion>({} as Sesion);
  console.log("esta es la sesion", sesion);

  useEffect(() => {
    const stored = sessionStorage.getItem("Sesion");
    if (stored) {
      setSesionState(JSON.parse(stored));
    }
  }, []);

  const setSesionEnContext = (sesion: Sesion) => {
    sessionStorage.setItem("Sesion", JSON.stringify(sesion));
    setSesionState(sesion);
  };

  return (
    <SesionContext.Provider value={{ sesion, setSesionEnContext }}>
      {children}
    </SesionContext.Provider>
  );
};

// Custom hook para usar fácilmente
export const useSesion = () => {
  const context = useContext(SesionContext);
  if (!context) {
    throw new Error("useSesion debe usarse dentro de SesionProvider");
  }
  return context;
};
