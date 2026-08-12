import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

function RotaProtegida({ children }) {

  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Dashboard() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {

    logout();

    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Bem-vindo ao Gerenciador de Eventos.
      </p>

      <button
        type="button"
        onClick={handleLogout}
      >
        Sair
      </button>
    </main>
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
        path="/"
        element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        }
      />

    </Routes>
  );
}

export default App;