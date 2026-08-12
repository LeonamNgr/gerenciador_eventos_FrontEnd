import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { cadastrar } from "../services/administradorService";

import "./NovoAdministrador.css";

function NovoAdministrador() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
    });

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleChange(event) {

        const { name, value } = event.target;

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setErro("");
            setCarregando(true);

            await cadastrar(formulario);

            navigate("/administradores");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {

                setErro(
                    "Verifique os dados informados."
                );

            } else if (error.response?.status === 401) {

                setErro(
                    "Você não possui autorização para cadastrar um administrador."
                );

            } else {

                setErro(
                    "Não foi possível cadastrar o administrador."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <section className="novo-administrador-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="novo-administrador-header">

                <button
                    type="button"
                    className="novo-administrador-back"
                    onClick={() =>
                        navigate("/administradores")
                    }
                >
                    ← Voltar para administradores
                </button>

                <span className="novo-administrador-eyebrow">
                    ADMINISTRAÇÃO
                </span>

                <h2>
                    Novo administrador
                </h2>

                <p>
                    Cadastre um novo administrador para acessar o sistema.
                </p>

            </div>


            {/* =========================
                FORMULÁRIO
            ========================= */}

            <div className="novo-administrador-card">

                <div className="novo-administrador-card-header">

                    <div className="novo-administrador-avatar">
                        👤
                    </div>

                    <div>

                        <h3>
                            Dados do administrador
                        </h3>

                        <p>
                            Preencha os dados abaixo para realizar o cadastro.
                        </p>

                    </div>

                </div>


                {/* =========================
                    ERRO
                ========================= */}

                {erro && (

                    <div className="novo-administrador-error">
                        {erro}
                    </div>

                )}


                <form
                    className="novo-administrador-form"
                    onSubmit={handleSubmit}
                >

                    {/* NOME */}

                    <div className="novo-administrador-field">

                        <label htmlFor="nome">
                            Nome
                        </label>

                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            value={formulario.nome}
                            onChange={handleChange}
                            maxLength={100}
                            placeholder="Digite o nome completo"
                            autoComplete="name"
                            required
                        />

                        <span>
                            Máximo de 100 caracteres.
                        </span>

                    </div>


                    {/* E-MAIL */}

                    <div className="novo-administrador-field">

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formulario.email}
                            onChange={handleChange}
                            maxLength={100}
                            placeholder="exemplo@email.com"
                            autoComplete="email"
                            required
                        />

                        <span>
                            Será utilizado para acessar o sistema.
                        </span>

                    </div>


                    {/* SENHA */}

                    <div className="novo-administrador-field">

                        <label htmlFor="senha">
                            Senha
                        </label>

                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            value={formulario.senha}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={20}
                            placeholder="Digite a senha"
                            autoComplete="new-password"
                            required
                        />

                        <span>
                            A senha deve possuir entre 8 e 20 caracteres.
                        </span>

                    </div>


                    {/* BOTÕES */}

                    <div className="novo-administrador-actions">

                        <button
                            type="button"
                            className="novo-administrador-cancel"
                            onClick={() =>
                                navigate("/administradores")
                            }
                            disabled={carregando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="novo-administrador-submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar administrador"}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default NovoAdministrador;