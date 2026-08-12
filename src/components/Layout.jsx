import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {

    const { autenticado, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/eventos", { replace: true });
    }

    function handleLogin() {
        navigate("/login");
    }

    return (
        <div>

            <header>

                <h1>Gerenciador de Eventos</h1>

                <nav>

                    <button
                        type="button"
                        onClick={() => navigate("/eventos")}
                    >
                        Eventos
                    </button>

                    {autenticado && (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                Dashboard
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/administradores")
                                }
                            >
                                Administradores
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>
                        </>
                    )}

                    {!autenticado && (
                        <button
                            type="button"
                            onClick={handleLogin}
                        >
                            Entrar
                        </button>
                    )}

                </nav>

            </header>

            <main>
                <Outlet />
            </main>

        </div>
    );
}

export default Layout;