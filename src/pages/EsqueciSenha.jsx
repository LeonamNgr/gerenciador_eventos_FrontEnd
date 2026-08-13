import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    solicitarAlteracaoSenha,
} from "../services/solicitacaoSenhaService";

import "../styles/EsqueciSenha.css";

function EsqueciSenha() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setErro("");
            setSucesso(false);
            setCarregando(true);

            await solicitarAlteracaoSenha(email);

            setSucesso(true);
            setEmail("");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 404) {

                setErro(
                    "Administrador não encontrado."
                );

            } else if (error.response?.status === 400) {

                setErro(
                    "Informe um e-mail válido."
                );

            } else {

                setErro(
                    "Não foi possível registrar a solicitação."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <main className="esqueci-senha-page">

            <div className="esqueci-senha-card">

                <div className="esqueci-senha-header">

                    <div className="esqueci-senha-icon">
                        🔑
                    </div>

                    <span className="esqueci-senha-eyebrow">
                        RECUPERAÇÃO DE ACESSO
                    </span>

                    <h1>
                        Esqueci minha senha
                    </h1>

                    <p>
                        Informe o e-mail cadastrado para
                        solicitar a alteração da sua senha.
                    </p>

                </div>


                {sucesso && (

                    <div className="esqueci-senha-success">

                        Solicitação registrada com sucesso.
                        Um administrador deverá analisar
                        sua solicitação e definir uma nova senha.

                    </div>

                )}


                {erro && (

                    <div className="esqueci-senha-error">

                        {erro}

                    </div>

                )}


                {!sucesso && (

                    <form
                        className="esqueci-senha-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="esqueci-senha-field">

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
                                placeholder="Digite seu e-mail"
                                autoComplete="email"
                                required
                                disabled={carregando}
                            />

                        </div>


                        <button
                            type="submit"
                            className="esqueci-senha-submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Enviando..."
                                : "Solicitar alteração de senha"}
                        </button>

                    </form>

                )}


                <button
                    type="button"
                    className="esqueci-senha-back"
                    onClick={() => navigate("/login")}
                    disabled={carregando}
                >
                    ← Voltar para o login
                </button>

            </div>

        </main>
    );
}

export default EsqueciSenha;