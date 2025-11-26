import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./componentes/herramientas/herramientas-visuales/theme-context";
import LoginPage from "./pages/login-page";
import AdministracionPage from "./pages/administracion-page";
import PrivateRoute from "./utils/PrivateRoute";
import { Rol } from "./interfaces/generales/interfaces-generales";
import PublicPage from "./pages/public-page";
import ConsultarProyectos from "./componentes/gestion-proyecto/consultar-proyecto";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          <Route element={
              <PrivateRoute allowedRoles={[Rol.ADMINISTRADOR, Rol.EMPLEADO]} />
            }>

            <Route path="/admin" element={<AdministracionPage />} >
              <Route element={<PrivateRoute allowedRoles={[Rol.EMPLEADO, Rol.ADMINISTRADOR]} />}>
                  <Route path="proyectos" element={<ConsultarProyectos />} />
              </Route>
            </Route>

          </Route>

          <Route element={
              <PrivateRoute allowedRoles={[Rol.ADMINISTRADOR, Rol.EMPLEADO, Rol.CLIENTE]} />
            }>
            <Route path="/public" element={<PublicPage />} >
              <Route element={<PrivateRoute allowedRoles={[Rol.ADMINISTRADOR, Rol.EMPLEADO, Rol.CLIENTE]} />}>
                  <Route path="proyectos" element={<ConsultarProyectos />} />
              </Route>
            </Route>
            
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
