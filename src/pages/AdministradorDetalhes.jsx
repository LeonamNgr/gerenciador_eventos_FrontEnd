import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    buscarPorId,
    deletar,
} from "../services/administradorService";

import "./AdministradorDetalhes.css";

function AdministradorDetalhes() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [administrador, setAdministrador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarAdministrador() {

            try {

                setErro("");

                const dados = await buscarPorId(id);

                setAdministrador(dados);

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


    async function handleDeletar() {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este administrador?"
        );

        if (!confirmar) {
            return;
        }

        try {

            setErro("");
            setExcluindo(true);

            await deletar(id);

            navigate("/administradores", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {

                setErro(
                    "Não é possível excluir este administrador."
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
                    "Não foi possível excluir o administrador."
                );
            }

        } finally {

            setExcluindo(false);
        }
    }


    /* =========================
       CARREGANDO
    ========================= */

    if (carregando) {

        return (
            <section className="administrador-detalhes-page">

                <div className="administrador-detalhes-state">

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

    if (erro && !administrador) {

        return (
            <section className="administrador-detalhes-page">

                <button
                    type="button"
                    className="administrador-detalhes-back"
                    onClick={() =>
                        navigate("/administradores")
                    }
                >
                    ← Voltar para administradores
                </button>


                <div className="administrador-detalhes-state administrador-detalhes-error-state">

                    <div className="administrador-detalhes-error-icon">
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
        <section className="administrador-detalhes-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="administrador-detalhes-header">

                <button
                    type="button"
                    className="administrador-detalhes-back"
                    onClick={() =>
                        navigate("/administradores")
                    }
                    disabled={excluindo}
                >
                    ← Voltar para administradores
                </button>

                <span className="administrador-detalhes-eyebrow">
                    ADMINISTRAÇÃO
                </span>

                <h2>
                    Detalhes do administrador
                </h2>

            </div>


            {/* =========================
                CARD
            ========================= */}

            <article className="administrador-detalhes-card">

                {/* PERFIL */}

                <div className="administrador-detalhes-profile">

                    <div className="administrador-detalhes-avatar">

                        {administrador.nome
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>

                    <div>

                        <h3>
                            {administrador.nome}
                        </h3>

                        <span>
                            Administrador do sistema
                        </span>

                    </div>

                </div>


                {/* DADOS */}

                <div className="administrador-detalhes-info">

                    <div className="administrador-detalhes-info-item">

                        <span>
                            NOME
                        </span>

                        <strong>
                            {administrador.nome}
                        </strong>

                    </div>


                    <div className="administrador-detalhes-info-item">

                        <span>
                            E-MAIL
                        </span>

                        <strong>
                            {administrador.email}
                        </strong>

                    </div>


                    <div className="administrador-detalhes-info-item">

                        <span>
                            ID
                        </span>

                        <strong>
                            {administrador.id}
                        </strong>

                    </div>

                </div>


                {/* ERRO */}

                {erro && (

                    <div className="administrador-detalhes-error">
                        {erro}
                    </div>

                )}


                {/* AÇÕES */}

                <div className="administrador-detalhes-actions">

                    <button
                        type="button"
                        className="administrador-detalhes-edit"
                        onClick={() =>
                            navigate(
                                `/administradores/${id}/editar`
                            )
                        }
                        disabled={excluindo}
                    >
                        Editar administrador
                    </button>


                    <button
                        type="button"
                        className="administrador-detalhes-delete"
                        onClick={handleDeletar}
                        disabled={excluindo}
                    >
                        {excluindo
                            ? "Excluindo..."
                            : "Excluir administrador"}
                    </button>

                </div>

            </article>

        </section>
    );
}

export default AdministradorDetalhes;