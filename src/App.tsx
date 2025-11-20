import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./componentes/herramientas/herramientas-visuales/theme-context";
import LoginPage from "./pages/login-page";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
