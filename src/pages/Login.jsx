import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {

            await login(email, senha);

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                setErro(
                    "E-mail ou senha inválidos."
                );
            } else {
                setErro(
                    "Não foi possível realizar o login."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <main className="login-page">

            <div className="login-container">

                <div className="login-brand">

                    <span>
                        GERENCIADOR
                    </span>

                    <h1>
                        DE EVENTOS
                    </h1>

                </div>

                <div className="login-card">

                    <div className="login-header">

                        <h2>
                            Entrar
                        </h2>

                        <p>
                            Acesse a área administrativa.
                        </p>

                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="login-field">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="seu@email.com"
                                autoComplete="email"
                                required
                            />

                        </div>

                        <div className="login-field">

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(event) =>
                                    setSenha(event.target.value)
                                }
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                                required
                            />

                        </div>

                        {erro && (
                            <div className="login-error">
                                {erro}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Entrando..."
                                : "Entrar"}
                        </button>

                    </form>

                    <button
                        type="button"
                        className="login-back-button"
                        onClick={() =>
                            navigate("/eventos")
                        }
                        disabled={carregando}
                    >
                        ← Voltar para eventos
                    </button>

                </div>

            </div>

        </main>
    );
}

export default Login;