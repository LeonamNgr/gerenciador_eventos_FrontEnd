import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import EditarEvento from "./pages/EditarEvento";
import EventoDetalhes from "./pages/EventoDetalhes";
import Eventos from "./pages/Eventos";
import NovoEvento from "./pages/NovoEvento";

import AdministradorDetalhes from "./pages/AdministradorDetalhes";
import Administradores from "./pages/Administradores";
import EditarAdministrador from "./pages/EditarAdministrador";
import EsqueciSenha from "./pages/EsqueciSenha";
import NovoAdministrador from "./pages/NovoAdministrador";
import SolicitacoesSenha from "./pages/SolicitacoesSenha";

import { useAuth } from "./context/AuthContext";


function RotaProtegida({ children }) {

  const { autenticado } = useAuth();

  if (!autenticado) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


function App() {

  return (
    <Routes>

      {/* =========================
                ÁREA PÚBLICA
            ========================= */}

      <Route
        element={<Layout />}
      >

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />
        {/* ESQUECI MINHA SENHA */}

        <Route
          path="/esqueci-senha"
          element={<EsqueciSenha />}
        />

        {/* EVENTOS */}

        <Route
          path="/"
          element={<Eventos />}
        />

        <Route
          path="/eventos"
          element={<Eventos />}
        />

        <Route
          path="/eventos/:id"
          element={<EventoDetalhes />}
        />


        {/* CADASTRO PÚBLICO */}

        <Route
          path="/administradores/novo"
          element={<NovoAdministrador />}
        />

      </Route>


      {/* =========================
                ÁREA PROTEGIDA
            ========================= */}

      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* EVENTOS */}

        <Route
          path="/eventos/novo"
          element={<NovoEvento />}
        />

        <Route
          path="/eventos/:id/editar"
          element={<EditarEvento />}
        />


        {/* ADMINISTRADORES */}

        <Route
          path="/administradores"
          element={<Administradores />}
        />

        <Route
          path="/administradores/:id/editar"
          element={<EditarAdministrador />}
        />

        <Route
          path="/administradores/:id"
          element={<AdministradorDetalhes />}
        />
        {/* SOLICITAÇÕES DE SENHA */}

        <Route
          path="/solicitacoes-senha"
          element={<SolicitacoesSenha />}
        />

      </Route>


      {/* =========================
                ROTA DESCONHECIDA
            ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;