import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Login.css";

const EMAIL_SALVO_KEY = "login_email";
const SENHA_SALVA_KEY = "login_senha";
const GRAVAR_SENHA_KEY = "gravar_senha";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [gravarSenha, setGravarSenha] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [popup, setPopup] = useState({
        aberto: false,
        titulo: "",
        mensagem: "",
    });

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {

        const gravar =
            localStorage.getItem(
                GRAVAR_SENHA_KEY
            ) === "true";

        if (gravar) {

            const emailSalvo =
                localStorage.getItem(
                    EMAIL_SALVO_KEY
                ) || "";

            const senhaSalva =
                localStorage.getItem(
                    SENHA_SALVA_KEY
                ) || "";

            setEmail(emailSalvo);
            setSenha(senhaSalva);
            setGravarSenha(true);
        }

    }, []);

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            fecharPopup();

            setCarregando(true);

            await login(email, senha);

            if (gravarSenha) {

                localStorage.setItem(
                    EMAIL_SALVO_KEY,
                    email
                );

                localStorage.setItem(
                    SENHA_SALVA_KEY,
                    senha
                );

                localStorage.setItem(
                    GRAVAR_SENHA_KEY,
                    "true"
                );

            } else {

                localStorage.removeItem(
                    EMAIL_SALVO_KEY
                );

                localStorage.removeItem(
                    SENHA_SALVA_KEY
                );

                localStorage.removeItem(
                    GRAVAR_SENHA_KEY
                );
            }

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                abrirPopup(
                    "Erro no login",
                    "E-mail ou senha inválidos."
                );

            } else if (error.response?.status === 400) {

                abrirPopup(
                    "Dados inválidos",
                    "Informe um e-mail e uma senha válidos."
                );

            } else {

                abrirPopup(
                    "Erro",
                    "Não foi possível realizar o login."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    function handleGravarSenha(event) {

        const marcado = event.target.checked;

        setGravarSenha(marcado);

        if (!marcado) {

            localStorage.removeItem(
                EMAIL_SALVO_KEY
            );

            localStorage.removeItem(
                SENHA_SALVA_KEY
            );

            localStorage.removeItem(
                GRAVAR_SENHA_KEY
            );
        }
    }

    function abrirPopup(titulo, mensagem) {

        setPopup({
            aberto: true,
            titulo,
            mensagem,
        });
    }

    function fecharPopup() {

        setPopup({
            aberto: false,
            titulo: "",
            mensagem: "",
        });
    }

    return (
        <main className="login-page">

            <div className="login-wrapper">

                <div className="login-brand">

                    <div className="login-brand-mark">
                        GE
                    </div>

                    <div>
                        <strong>
                            Gerenciador de Eventos
                        </strong>

                        <span>
                            Administração de eventos
                        </span>
                    </div>

                </div>


                <section className="login-card">

                    <div className="login-header">

                        <span className="login-eyebrow">
                            ACESSO
                        </span>

                        <h1>
                            Entrar
                        </h1>

                        <p>
                            Informe suas credenciais para acessar o sistema.
                        </p>

                    </div>


                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="login-field">

                            <label htmlFor="email">
                                E-mail do Administrador
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Digite seu e-mail"
                                required
                                autoComplete="email"
                            />

                        </div>


                        <div className="login-field">

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <div className="login-password">

                                <input
                                    id="senha"
                                    name="senha"
                                    type={
                                        mostrarSenha
                                            ? "text"
                                            : "password"
                                    }
                                    value={senha}
                                    onChange={(event) =>
                                        setSenha(event.target.value)
                                    }
                                    placeholder="Digite sua senha"
                                    required
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() =>
                                        setMostrarSenha(
                                            !mostrarSenha
                                        )
                                    }
                                    aria-label={
                                        mostrarSenha
                                            ? "Ocultar senha"
                                            : "Mostrar senha"
                                    }
                                >
                                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                                </button>

                            </div>

                        </div>


                        <div className="login-options">

                            <label className="login-checkbox">

                                <input
                                    type="checkbox"
                                    checked={gravarSenha}
                                    onChange={handleGravarSenha}
                                />

                                <span>
                                    Gravar Senha
                                </span>

                            </label>

                            <button
                                type="button"
                                className="login-forgot"
                                onClick={() =>
                                    alert(
                                        "A recuperação de senha será disponibilizada em breve."
                                    )
                                }
                            >
                                Esqueci minha senha
                            </button>

                        </div>


                        <button
                            type="submit"
                            className="login-submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Entrando..."
                                : "Entrar"}
                        </button>


                        <div className="login-register-area">

                            <span>
                                Ainda não possui uma conta?
                            </span>

                            <button
                                type="button"
                                className="login-register"
                                onClick={() =>
                                    navigate(
                                        "/administradores/novo"
                                    )
                                }
                                disabled={carregando}
                            >
                                Cadastrar-se
                            </button>

                        </div>

                    </form>

                </section>


                <p className="login-footer">
                    © 2026 Gerenciador de Eventos
                </p>

            </div>


            {/* =========================
                POPUP
            ========================= */}

            {popup.aberto && (

                <div
                    className="login-popup-overlay"
                    onClick={fecharPopup}
                >

                    <div
                        className="login-popup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="login-popup-icon">
                            !
                        </div>

                        <h2>
                            {popup.titulo}
                        </h2>

                        <p>
                            {popup.mensagem}
                        </p>

                        <button
                            type="button"
                            className="login-popup-button"
                            onClick={fecharPopup}
                        >
                            Entendi
                        </button>

                    </div>

                </div>
            )}

        </main>
    );
}

export default Login;