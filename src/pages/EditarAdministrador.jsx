import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    alterarSenha,
    buscarPorId,
    editar,
} from "../services/administradorService";

import { useAuth } from "../context/AuthContext";

import CampoSenha from "../components/CampoSenha";
import "../styles/EditarAdministrador.css";

function EditarAdministrador() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { administrador: administradorLogado } = useAuth();


    const ehAdministradorLogado =
        administradorLogado &&
        String(administradorLogado.id) === String(id);


    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
    });


    const [senhaFormulario, setSenhaFormulario] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
    });


    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [alterandoSenha, setAlterandoSenha] = useState(false);

    const [erro, setErro] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [sucessoSenha, setSucessoSenha] = useState("");


    useEffect(() => {

        async function carregarAdministrador() {

            try {

                setErro("");

                const administrador =
                    await buscarPorId(id);

                setFormulario({
                    nome: administrador.nome ?? "",
                    email: administrador.email ?? "",
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


    function handleSenhaChange(event) {

        const { name, value } = event.target;

        setSenhaFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value,
        }));

        setErroSenha("");
        setSucessoSenha("");
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

            } else if (error.response?.status === 409) {

                setErro(
                    "Este e-mail já está cadastrado."
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


    async function handleAlterarSenha(event) {

        event.preventDefault();

        setErroSenha("");
        setSucessoSenha("");

        /*
         * Validação da nova senha
         */
        if (
            senhaFormulario.novaSenha.length < 8 ||
            senhaFormulario.novaSenha.length > 20
        ) {

            setErroSenha(
                "A nova senha deve possuir entre 8 e 20 caracteres."
            );

            return;
        }


        /*
         * Confirmação da nova senha
         */
        if (
            senhaFormulario.novaSenha !==
            senhaFormulario.confirmarNovaSenha
        ) {

            setErroSenha(
                "A nova senha e a confirmação da senha não conferem."
            );

            return;
        }


        try {

            setAlterandoSenha(true);

            await alterarSenha({
                senhaAtual: senhaFormulario.senhaAtual,
                novaSenha: senhaFormulario.novaSenha,
                confirmarNovaSenha:
                    senhaFormulario.confirmarNovaSenha,
            });


            setSenhaFormulario({
                senhaAtual: "",
                novaSenha: "",
                confirmarNovaSenha: "",
            });


            setSucessoSenha(
                "Senha alterada com sucesso."
            );

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {

                setErroSenha(
                    error.response?.data?.mensagem ||
                    "Verifique os dados informados."
                );

            } else if (error.response?.status === 401) {

                setErroSenha(
                    error.response?.data?.mensagem ||
                    "A senha atual está incorreta ou sua sessão expirou."
                );

            } else {

                setErroSenha(
                    "Não foi possível alterar a senha."
                );
            }

        } finally {

            setAlterandoSenha(false);
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
                    disabled={
                        salvando ||
                        alterandoSenha
                    }
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
                    ERRO GERAL
                ========================= */}

                {erro && (

                    <div className="editar-administrador-error">
                        {erro}
                    </div>

                )}


                {/* =========================
                    FORMULÁRIO DE DADOS
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
                            disabled={salvando}
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
                            disabled={salvando}
                        />

                        <span>
                            Será utilizado para acessar o sistema.
                        </span>

                    </div>


                    {/* =========================
                        AÇÕES DOS DADOS
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
                            disabled={
                                salvando ||
                                alterandoSenha
                            }
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="editar-administrador-submit"
                            disabled={
                                salvando ||
                                alterandoSenha
                            }
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>

                    </div>

                </form>


                {/* =================================================
                    ALTERAÇÃO DE SENHA
                    SOMENTE PARA O ADMINISTRADOR LOGADO
                ================================================= */}

                {ehAdministradorLogado && (

                    <div className="editar-administrador-password-section">

                        <div className="editar-administrador-section-divider" />

                        <div className="editar-administrador-password-header">

                            <div>

                                <span className="editar-administrador-password-eyebrow">
                                    SEGURANÇA
                                </span>

                                <h3>
                                    Alterar senha
                                </h3>

                                <p>
                                    Para alterar sua senha, informe a senha atual e defina uma nova senha.
                                </p>

                            </div>

                        </div>


                        {/* ERRO DA SENHA */}

                        {erroSenha && (

                            <div className="editar-administrador-error">
                                {erroSenha}
                            </div>

                        )}


                        {/* SUCESSO */}

                        {sucessoSenha && (

                            <div className="editar-administrador-success">
                                {sucessoSenha}
                            </div>

                        )}


                        <form
                            className="editar-administrador-form"
                            onSubmit={handleAlterarSenha}
                        >

                            {/* SENHA ATUAL */}

                            <div className="editar-administrador-field">

                                <label htmlFor="senhaAtual">
                                    Senha atual
                                </label>

                                <CampoSenha
                                    id="senhaAtual"
                                    name="senhaAtual"
                                    label="Senha atual"
                                    value={senhaFormulario.senhaAtual}
                                    onChange={handleSenhaChange}
                                    autoComplete="current-password"
                                    required
                                    disabled={alterandoSenha}
                                />

                                <span>
                                    Informe sua senha atual.
                                </span>

                            </div>


                            {/* NOVA SENHA */}

                            <div className="editar-administrador-field">

                                <label htmlFor="novaSenha">
                                    Nova senha
                                </label>

                                <CampoSenha
                                    id="novaSenha"
                                    name="novaSenha"
                                    label="Nova senha"
                                    value={senhaFormulario.novaSenha}
                                    onChange={handleSenhaChange}
                                    minLength={8}
                                    maxLength={20}
                                    autoComplete="new-password"
                                    required
                                    disabled={alterandoSenha}
                                />

                                <span>
                                    A senha deve possuir entre 8 e 20 caracteres.
                                </span>

                            </div>


                            {/* CONFIRMAR NOVA SENHA */}

                            <div className="editar-administrador-field">

                                <label htmlFor="confirmarNovaSenha">
                                    Confirmar nova senha
                                </label>

                                <CampoSenha
                                    id="confirmarNovaSenha"
                                    name="confirmarNovaSenha"
                                    label="Confirmar nova senha"
                                    value={senhaFormulario.confirmarNovaSenha}
                                    onChange={handleSenhaChange}
                                    minLength={8}
                                    maxLength={20}
                                    autoComplete="new-password"
                                    required
                                    disabled={alterandoSenha}
                                />

                                <span>
                                    Digite novamente a nova senha.
                                </span>

                            </div>


                            {/* BOTÃO ALTERAR SENHA */}

                            <div className="editar-administrador-password-actions">

                                <button
                                    type="submit"
                                    className="editar-administrador-submit"
                                    disabled={alterandoSenha}
                                >
                                    {alterandoSenha
                                        ? "Alterando senha..."
                                        : "Alterar senha"}
                                </button>

                            </div>

                        </form>

                    </div>
                )}

            </div>

        </section>
    );
}

export default EditarAdministrador;