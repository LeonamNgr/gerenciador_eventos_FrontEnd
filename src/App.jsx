import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";

import EditarEvento from "./pages/EditarEvento";
import EventoDetalhes from "./pages/EventoDetalhes";
import Eventos from "./pages/Eventos";
import NovoEvento from "./pages/NovoEvento";

import AdministradorDetalhes from "./pages/AdministradorDetalhes";
import Administradores from "./pages/Administradores";
import EditarAdministrador from "./pages/EditarAdministrador";
import NovoAdministrador from "./pages/NovoAdministrador";

import { useAuth } from "./context/AuthContext";

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

        {/* EVENTOS */}

        <Route
          path="/eventos"
          element={<Eventos />}
        />

        <Route
          path="/eventos/novo"
          element={<NovoEvento />}
        />

        <Route
          path="/eventos/:id/editar"
          element={<EditarEvento />}
        />

        <Route
          path="/eventos/:id"
          element={<EventoDetalhes />}
        />

        {/* ADMINISTRADORES */}

        <Route
          path="/administradores"
          element={<Administradores />}
        />

        <Route
          path="/administradores/novo"
          element={<NovoAdministrador />}
        />

        <Route
          path="/administradores/:id/editar"
          element={<EditarAdministrador />}
        />

        <Route
          path="/administradores/:id"
          element={<AdministradorDetalhes />}
        />

      </Route>

    </Routes>
  );
}

export default App;