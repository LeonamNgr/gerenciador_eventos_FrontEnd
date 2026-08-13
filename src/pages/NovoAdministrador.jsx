import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { cadastrar } from "../services/administradorService";

import "../styles/NovoAdministrador.css";

function NovoAdministrador() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
    });

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleChange(event) {

        const { name, value } = event.target;

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value,
        }));

        setErro("");
        setSucesso("");
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setErro("");
        setSucesso("");

        if (
            formulario.senha !==
            formulario.confirmarSenha
        ) {

            setErro(
                "A senha e a confirmação da senha não conferem."
            );

            return;
        }

        try {

            setCarregando(true);

            const dados = {
                nome: formulario.nome,
                email: formulario.email,
                senha: formulario.senha,
            };

            await cadastrar(dados);

            setFormulario({
                nome: "",
                email: "",
                senha: "",
                confirmarSenha: "",
            });

            setSucesso(
                "Administrador cadastrado com sucesso."
            );

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

            } else if (error.response?.status === 409) {

                setErro(
                    "Este e-mail já está cadastrado."
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
        <main className="novo-administrador-page">

            <div className="novo-administrador-wrapper">

                <div className="novo-administrador-brand">

                    <div className="novo-administrador-brand-mark">
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


                <button
                    type="button"
                    className="novo-administrador-back"
                    onClick={() =>
                        navigate("/login")
                    }
                    disabled={carregando}
                >
                    ← Voltar para o login
                </button>


                <section className="novo-administrador-card">

                    <div className="novo-administrador-header">

                        <span className="novo-administrador-eyebrow">
                            NOVA CONTA
                        </span>

                        <h1>
                            Criar administrador
                        </h1>

                        <p>
                            Preencha os dados abaixo para criar seu acesso ao sistema.
                        </p>

                    </div>


                    {erro && (

                        <div className="novo-administrador-message error">
                            {erro}
                        </div>

                    )}


                    {sucesso && (

                        <div className="novo-administrador-success">

                            <div className="novo-administrador-success-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Cadastro realizado
                                </strong>

                                <p>
                                    {sucesso}
                                </p>

                            </div>

                        </div>

                    )}


                    {!sucesso && (

                        <form
                            className="novo-administrador-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="novo-administrador-field">

                                <label htmlFor="nome">
                                    Nome do Administrador
                                </label>

                                <input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formulario.nome}
                                    onChange={handleChange}
                                    maxLength={100}
                                    placeholder="Digite seu nome"
                                    required
                                    autoComplete="name"
                                />

                            </div>


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
                                    placeholder="Digite seu e-mail"
                                    required
                                    autoComplete="email"
                                />

                            </div>


                            <div className="novo-administrador-field">

                                <label htmlFor="senha">
                                    Senha
                                </label>

                                <div className="novo-administrador-password">

                                    <input
                                        id="senha"
                                        name="senha"
                                        type={
                                            mostrarSenha
                                                ? "text"
                                                : "password"
                                        }
                                        value={formulario.senha}
                                        onChange={handleChange}
                                        minLength={8}
                                        maxLength={20}
                                        placeholder="Crie uma senha"
                                        required
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="novo-administrador-password-toggle"
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
                                        {mostrarSenha
                                            ? "Ocultar"
                                            : "Mostrar"}
                                    </button>

                                </div>

                                <span>
                                    A senha deve possuir entre 8 e 20 caracteres.
                                </span>

                            </div>


                            <div className="novo-administrador-field">

                                <label htmlFor="confirmarSenha">
                                    Confirmar Senha
                                </label>

                                <div className="novo-administrador-password">

                                    <input
                                        id="confirmarSenha"
                                        name="confirmarSenha"
                                        type={
                                            mostrarConfirmacao
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            formulario.confirmarSenha
                                        }
                                        onChange={handleChange}
                                        minLength={8}
                                        maxLength={20}
                                        placeholder="Digite a senha novamente"
                                        required
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="novo-administrador-password-toggle"
                                        onClick={() =>
                                            setMostrarConfirmacao(
                                                !mostrarConfirmacao
                                            )
                                        }
                                        aria-label={
                                            mostrarConfirmacao
                                                ? "Ocultar confirmação"
                                                : "Mostrar confirmação"
                                        }
                                    >
                                        {mostrarConfirmacao
                                            ? "Ocultar"
                                            : "Mostrar"}
                                    </button>

                                </div>

                            </div>


                            <div className="novo-administrador-actions">

                                <button
                                    type="button"
                                    className="novo-administrador-cancel"
                                    onClick={() =>
                                        navigate("/login")
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
                                        : "Criar administrador"}
                                </button>

                            </div>

                        </form>

                    )}


                    {sucesso && (

                        <div className="novo-administrador-success-actions">

                            <button
                                type="button"
                                className="novo-administrador-submit"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Ir para o login
                            </button>

                        </div>

                    )}

                </section>


                <p className="novo-administrador-footer">
                    © 2026 Gerenciador de Eventos
                </p>

            </div>

        </main>
    );
}

export default NovoAdministrador;