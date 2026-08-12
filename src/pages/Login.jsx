import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

            navigate("/", { replace: true });

        } catch (error) {

            if (error.response?.status === 401) {
                setErro("E-mail ou senha inválidos.");
            } else {
                setErro("Não foi possível realizar o login.");
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <main>
            <h1>Gerenciador de Eventos</h1>

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <div>
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
                        required
                    />
                </div>

                <div>
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
                        required
                    />
                </div>

                {erro && (
                    <p>{erro}</p>
                )}

                <button
                    type="submit"
                    disabled={carregando}
                >
                    {carregando
                        ? "Entrando..."
                        : "Entrar"}
                </button>

            </form>
        </main>
    );
}

export default Login;