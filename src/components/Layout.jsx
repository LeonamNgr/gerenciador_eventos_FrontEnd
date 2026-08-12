import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div>
            <header>
                <h1>Gerenciador de Eventos</h1>

                <nav>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/eventos")}
                    >
                        Eventos
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/administradores")}
                    >
                        Administradores
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;