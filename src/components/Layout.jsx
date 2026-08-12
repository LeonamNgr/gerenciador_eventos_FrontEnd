import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Layout.css";

function Layout() {

    const {
        logout,
        autenticado,
    } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    function handleLogout() {

        logout();

        navigate("/login", {
            replace: true,
        });
    }

    function estaAtivo(caminho) {

        if (caminho === "/eventos") {

            return (
                location.pathname === "/" ||
                location.pathname.startsWith("/eventos")
            );
        }

        return location.pathname.startsWith(caminho);
    }

    return (
        <div className="layout">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="navbar">

                <div className="navbar-container">

                    {/* LOGO */}

                    <button
                        type="button"
                        className="navbar-brand"
                        onClick={() =>
                            navigate("/")
                        }
                    >

                        <strong>
                            Gerenciador
                        </strong>

                        <span>
                            de Eventos
                        </span>

                    </button>


                    {/* NAVEGAÇÃO */}

                    <nav className="navbar-nav">

                        <button
                            type="button"
                            className={
                                estaAtivo("/eventos")
                                    ? "navbar-link active"
                                    : "navbar-link"
                            }
                            onClick={() =>
                                navigate("/eventos")
                            }
                        >
                            Eventos
                        </button>


                        {autenticado && (

                            <>

                                <button
                                    type="button"
                                    className={
                                        estaAtivo("/dashboard")
                                            ? "navbar-link active"
                                            : "navbar-link"
                                    }
                                    onClick={() =>
                                        navigate("/dashboard")
                                    }
                                >
                                    Dashboard
                                </button>


                                <button
                                    type="button"
                                    className={
                                        estaAtivo(
                                            "/administradores"
                                        )
                                            ? "navbar-link active"
                                            : "navbar-link"
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/administradores"
                                        )
                                    }
                                >
                                    Administradores
                                </button>

                            </>

                        )}

                    </nav>


                    {/* LOGIN / LOGOUT */}

                    <div className="navbar-actions">

                        {autenticado ? (

                            <button
                                type="button"
                                className="navbar-button logout"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>

                        ) : (

                            <button
                                type="button"
                                className="navbar-button login"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Entrar
                            </button>

                        )}

                    </div>

                </div>

            </header>


            {/* =========================
                CONTEÚDO
            ========================= */}

            <main className="layout-content">

                <Outlet />

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-brand">

                        <strong>
                            Gerenciador de Eventos
                        </strong>

                        <span>
                            Sistema de gerenciamento de eventos
                        </span>

                    </div>


                    <div className="footer-info">

                        <span>
                            © 2026 Gerenciador de Eventos
                        </span>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Layout;