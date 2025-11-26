import React, { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../componentes/herramientas/alertas/alertas-confirmacion";
import { useSesion } from "../componentes/herramientas/context/SesionContext";


interface PrivateRouteProps {
  allowedRoles: number[];
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { sesion } = useSesion();
  const sesionStorage = sessionStorage.getItem("Sesion");
  const location = useLocation();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  // Estado de control
  let content: React.ReactNode = null;

  const sesionValida = sesionStorage && sesionStorage.length > 3;

  // Hook debe llamarse siempre
  useEffect(() => {
    if (sesionValida && !allowedRoles.includes(sesion.rolId)) {
      const handleConfirmation = async () => {
        const confirmed = await showConfirmation({
          type: TipoAlertaConfirmacion.WARNING_ERROR,
          title: TituloAlertaConfirmacion.WARNING_ERROR,
          message: "No tienes permiso para acceder a esta sección.",
          confirmText: "Aceptar",
          cancelText: "Cancelar",
          onConfirm: () => {},
        });
        if (confirmed) {
          window.location.href = "/admin";
        }
      };
      handleConfirmation();
    }
  }, [sesionValida, allowedRoles, sesion.rolId, showConfirmation]);

  // Ahora decidimos el contenido a renderizar
  if (!sesionValida) {
    content = <Navigate to="/" state={{ from: location }} replace />;
  } else if (allowedRoles.includes(sesion.rolId)) {
    content = <Outlet />;
  } else {
    content = <AlertasConfirmacion />;
  }

  return <>{content}</>;
};

export default PrivateRoute;
