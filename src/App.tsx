import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./componentes/herramientas/herramientas-visuales/theme-context";
import LoginPage from "./pages/login-page";
import AdministracionPage from "./pages/administracion-page";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdministracionPage />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
