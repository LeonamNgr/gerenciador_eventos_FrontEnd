import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Administradores from "./pages/Administradores";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";

function RotaProtegida({ children }) {

  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Dashboard() {

  return (
    <section>
      <h2>Dashboard</h2>

      <p>
        Bem-vindo ao Gerenciador de Eventos.
      </p>
    </section>
  );
}

function App() {

  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/eventos"
          element={<Eventos />}
        />

        <Route
          path="/administradores"
          element={<Administradores />}
        />
      </Route>

    </Routes>
  );
}

export default App;