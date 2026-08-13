import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    buscarPorId,
    deletar,
} from "../services/eventoService";

import { useAuth } from "../context/AuthContext";

import {
    formatarData,
    formatarHora,
} from "../utils/formatadores";

import "../styles/EventoDetalhes.css";

function EventoDetalhes() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        autenticado,
    } = useAuth();

    const [evento, setEvento] = useState(null);

    const [carregando, setCarregando] = useState(true);

    const [excluindo, setExcluindo] = useState(false);

    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarEvento() {

            try {

                setErro("");

                const dados = await buscarPorId(id);

                setEvento(dados);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 404) {

                    setErro(
                        "Evento não encontrado."
                    );

                } else {

                    setErro(
                        "Não foi possível carregar o evento."
                    );
                }

            } finally {

                setCarregando(false);
            }
        }

        carregarEvento();

    }, [id]);


    async function handleDeletar() {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este evento?"
        );

        if (!confirmar) {
            return;
        }

        try {

            setErro("");

            setExcluindo(true);

            await deletar(id);

            navigate("/eventos", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                setErro(
                    "Sua sessão expirou. Faça login novamente."
                );

            } else if (error.response?.status === 404) {

                setErro(
                    "Evento não encontrado."
                );

            } else {

                setErro(
                    "Não foi possível excluir o evento."
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
            <section className="evento-detalhes-page">

                <div className="evento-detalhes-state">

                    <p>
                        Carregando evento...
                    </p>

                </div>

            </section>
        );
    }


    /* =========================
       ERRO
    ========================= */

    if (erro && !evento) {

        return (
            <section className="evento-detalhes-page">

                <button
                    type="button"
                    className="evento-back-button"
                    onClick={() =>
                        navigate("/eventos")
                    }
                >
                    ← Voltar para eventos
                </button>


                <div className="evento-detalhes-state evento-detalhes-error">

                    <h2>
                        Evento não encontrado
                    </h2>

                    <p>
                        {erro}
                    </p>

                </div>

            </section>
        );
    }


    /* =========================
       EVENTO
    ========================= */

    return (
        <section className="evento-detalhes-page">

            <button
                type="button"
                className="evento-back-button"
                onClick={() =>
                    navigate("/eventos")
                }
                disabled={excluindo}
            >
                ← Voltar para eventos
            </button>


            <article className="evento-detalhes-card">

                {/* =========================
                    IMAGEM
                ========================= */}

                <div className="evento-detalhes-image">

                    {evento.imagem ? (

                        <img
                            src={evento.imagem}
                            alt={`Imagem do evento ${evento.nomeEvento}`}
                        />

                    ) : (

                        <div className="evento-detalhes-image-placeholder">

                            <span>
                                Sem imagem
                            </span>

                        </div>

                    )}

                </div>


                {/* =========================
                    CONTEÚDO
                ========================= */}

                <div className="evento-detalhes-content">

                    <span className="evento-detalhes-eyebrow">
                        EVENTO
                    </span>


                    <h2>
                        {evento.nomeEvento}
                    </h2>


                    {/* =========================
                        INFORMAÇÕES
                    ========================= */}

                    <div className="evento-detalhes-info">

                        <div className="evento-info-item">

                            <span className="evento-info-label">
                                DATA
                            </span>

                            <span className="evento-info-value">
                                {formatarData(
                                    evento.data
                                )}
                            </span>

                        </div>


                        <div className="evento-info-item">

                            <span className="evento-info-label">
                                HORÁRIO
                            </span>

                            <span className="evento-info-value">
                                {formatarHora(
                                    evento.hora
                                )}
                            </span>

                        </div>


                        <div className="evento-info-item">

                            <span className="evento-info-label">
                                LOCAL
                            </span>

                            <span className="evento-info-value">
                                {evento.local}
                            </span>

                        </div>


                        {/* ADMINISTRADOR */}

                        {autenticado &&
                            evento.administradorNome && (

                                <div className="evento-info-item">

                                    <span className="evento-info-label">
                                        CRIADO POR
                                    </span>

                                    <span className="evento-info-value">
                                        {evento.administradorNome}
                                    </span>

                                </div>

                            )}

                    </div>


                    {/* =========================
                        DESCRIÇÃO
                    ========================= */}

                    <div className="evento-descricao">

                        <h3>
                            Sobre o evento
                        </h3>

                        <p>
                            {evento.descricao ||
                                "Nenhuma descrição informada."}
                        </p>

                    </div>


                    {/* =========================
                        ERRO
                    ========================= */}

                    {erro && (

                        <div className="evento-detalhes-error-message">

                            {erro}

                        </div>

                    )}


                    {/* =========================
                        AÇÕES
                    ========================= */}

                    {autenticado && (

                        <div className="evento-detalhes-actions">

                            <button
                                type="button"
                                className="evento-edit-button"
                                onClick={() =>
                                    navigate(
                                        `/eventos/${id}/editar`
                                    )
                                }
                                disabled={excluindo}
                            >
                                Editar evento
                            </button>


                            <button
                                type="button"
                                className="evento-delete-button"
                                onClick={handleDeletar}
                                disabled={excluindo}
                            >
                                {excluindo
                                    ? "Excluindo..."
                                    : "Excluir evento"}
                            </button>

                        </div>

                    )}

                </div>

            </article>

        </section>
    );
}

export default EventoDetalhes;