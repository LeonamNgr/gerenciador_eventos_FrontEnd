import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    buscarPorId,
    editar,
} from "../services/administradorService";

import "./EditarAdministrador.css";

function EditarAdministrador() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
    });

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarAdministrador() {

            try {

                setErro("");

                const administrador =
                    await buscarPorId(id);

                setFormulario({
                    nome: administrador.nome ?? "",
                    email: administrador.email ?? "",
                    senha: "",
                });

            } catch (error) {

                console.error(error);

                if (error.response?.status === 404) {

                    setErro(
                        "Administrador não encontrado."
                    );

                } else {

                    setErro(
                        "Não foi possível carregar o administrador."
                    );
                }

            } finally {

                setCarregando(false);
            }
        }

        carregarAdministrador();

    }, [id]);


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
            setSalvando(true);

            const dados = {
                nome: formulario.nome,
                email: formulario.email,
            };

            /*
             * A senha só é enviada quando
             * o administrador informou uma nova senha.
             */
            if (formulario.senha.trim()) {

                dados.senha =
                    formulario.senha;
            }

            await editar(id, dados);

            navigate(
                `/administradores/${id}`
            );

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {

                setErro(
                    "Verifique os dados informados."
                );

            } else if (error.response?.status === 401) {

                setErro(
                    "Sua sessão expirou. Faça login novamente."
                );

            } else if (error.response?.status === 404) {

                setErro(
                    "Administrador não encontrado."
                );

            } else {

                setErro(
                    "Não foi possível editar o administrador."
                );
            }

        } finally {

            setSalvando(false);
        }
    }


    /* =========================
       CARREGANDO
    ========================= */

    if (carregando) {

        return (
            <section className="editar-administrador-page">

                <div className="editar-administrador-state">

                    <p>
                        Carregando administrador...
                    </p>

                </div>

            </section>
        );
    }


    /* =========================
       ERRO AO CARREGAR
    ========================= */

    if (erro && !formulario.nome) {

        return (
            <section className="editar-administrador-page">

                <button
                    type="button"
                    className="editar-administrador-back"
                    onClick={() =>
                        navigate(
                            "/administradores"
                        )
                    }
                >
                    ← Voltar para administradores
                </button>


                <div className="editar-administrador-state editar-administrador-error-state">

                    <div className="editar-administrador-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Administrador não encontrado
                    </h2>

                    <p>
                        {erro}
                    </p>

                </div>

            </section>
        );
    }


    return (
        <section className="editar-administrador-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="editar-administrador-header">

                <button
                    type="button"
                    className="editar-administrador-back"
                    onClick={() =>
                        navigate(
                            `/administradores/${id}`
                        )
                    }
                    disabled={salvando}
                >
                    ← Voltar para detalhes
                </button>

                <span className="editar-administrador-eyebrow">
                    ADMINISTRAÇÃO
                </span>

                <h2>
                    Editar administrador
                </h2>

                <p>
                    Atualize os dados do administrador.
                </p>

            </div>


            {/* =========================
                CARD
            ========================= */}

            <div className="editar-administrador-card">

                <div className="editar-administrador-card-header">

                    <div className="editar-administrador-avatar">

                        {formulario.nome
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>

                    <div>

                        <h3>
                            {formulario.nome}
                        </h3>

                        <p>
                            Atualização dos dados da conta.
                        </p>

                    </div>

                </div>


                {/* =========================
                    ERRO
                ========================= */}

                {erro && (

                    <div className="editar-administrador-error">
                        {erro}
                    </div>

                )}


                {/* =========================
                    FORMULÁRIO
                ========================= */}

                <form
                    className="editar-administrador-form"
                    onSubmit={handleSubmit}
                >

                    {/* NOME */}

                    <div className="editar-administrador-field">

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
                            autoComplete="name"
                            required
                        />

                        <span>
                            Máximo de 100 caracteres.
                        </span>

                    </div>


                    {/* E-MAIL */}

                    <div className="editar-administrador-field">

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
                            autoComplete="email"
                            required
                        />

                        <span>
                            Será utilizado para acessar o sistema.
                        </span>

                    </div>


                    {/* SENHA */}

                    <div className="editar-administrador-field">

                        <label htmlFor="senha">
                            Nova senha
                        </label>

                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            value={formulario.senha}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={20}
                            placeholder="Deixe vazio para manter a senha atual"
                            autoComplete="new-password"
                        />

                        <span>
                            Preencha somente se desejar alterar a senha.
                            A senha deve possuir entre 8 e 20 caracteres.
                        </span>

                    </div>


                    {/* =========================
                        AÇÕES
                    ========================= */}

                    <div className="editar-administrador-actions">

                        <button
                            type="button"
                            className="editar-administrador-cancel"
                            onClick={() =>
                                navigate(
                                    `/administradores/${id}`
                                )
                            }
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="editar-administrador-submit"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default EditarAdministrador;