import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    buscarTodos,
    contarMeusEventos,
} from "../services/eventoService";

import {
    formatarData,
    formatarHora,
} from "../utils/formatadores";

import { useAuth } from "../context/AuthContext";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const { autenticado } = useAuth();

    const [eventos, setEventos] = useState([]);
    const [meusEventos, setMeusEventos] = useState(0);

    const [carregando, setCarregando] = useState(true);
    const [carregandoMeusEventos, setCarregandoMeusEventos] =
        useState(true);

    const [erro, setErro] = useState("");


    useEffect(() => {

        async function carregarDashboard() {

            try {

                setErro("");

                /*
                 * Carrega todos os eventos públicos
                 * para os indicadores gerais e a
                 * lista de próximos eventos.
                 */
                const dados = await buscarTodos();

                setEventos(dados);


                /*
                 * Carrega a quantidade de eventos
                 * cadastrados pelo administrador
                 * autenticado.
                 */
                if (autenticado) {

                    const quantidade =
                        await contarMeusEventos();

                    setMeusEventos(quantidade);
                }

            } catch (error) {

                console.error(error);

                setErro(
                    "Não foi possível carregar os dados do dashboard."
                );

            } finally {

                setCarregando(false);
                setCarregandoMeusEventos(false);
            }
        }

        carregarDashboard();

    }, [autenticado]);


    /*
     * Data atual sem considerar horário.
     */
    function obterDataHoje() {

        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        return hoje;
    }


    /*
     * Converte a data recebida pela API.
     */
    function converterData(data) {

        if (!data) {
            return null;
        }

        return new Date(
            `${data}T00:00:00`
        );
    }


    const hoje = obterDataHoje();


    /*
     * Eventos futuros.
     */
    const proximosEventos = [...eventos]
        .filter((evento) => {

            const dataEvento =
                converterData(evento.data);

            if (!dataEvento) {
                return false;
            }

            return dataEvento >= hoje;
        })
        .sort((a, b) => {

            const dataA =
                converterData(a.data);

            const dataB =
                converterData(b.data);

            return dataA - dataB;
        });


    /*
     * Eventos que acontecem hoje.
     */
    const eventosHoje = eventos.filter((evento) => {

        const dataEvento =
            converterData(evento.data);

        if (!dataEvento) {
            return false;
        }

        return (
            dataEvento.getTime() ===
            hoje.getTime()
        );
    });


    /*
     * Apenas os 5 próximos eventos
     * são exibidos na lista.
     */
    const proximosEventosExibidos =
        proximosEventos.slice(0, 5);


    return (
        <section className="dashboard-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        VISÃO GERAL
                    </span>

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Acompanhe os eventos cadastrados no sistema.
                    </p>

                </div>


                <button
                    type="button"
                    className="dashboard-primary-button"
                    onClick={() =>
                        navigate("/eventos")
                    }
                >
                    Ver eventos
                </button>

            </div>


            {/* =========================
                ERRO
            ========================= */}

            {erro && (

                <div className="dashboard-error">
                    {erro}
                </div>

            )}


            {/* =========================
                CARDS
            ========================= */}

            <div className="dashboard-stats">

                {/* =========================
                    TOTAL
                ========================= */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        📅
                    </div>

                    <span className="dashboard-stat-label">
                        TOTAL DE EVENTOS
                    </span>

                    <strong className="dashboard-stat-value">

                        {carregando
                            ? "..."
                            : eventos.length}

                    </strong>

                    <span className="dashboard-stat-description">
                        eventos cadastrados
                    </span>

                </div>


                {/* =========================
                    PRÓXIMOS
                ========================= */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        🗓️
                    </div>

                    <span className="dashboard-stat-label">
                        PRÓXIMOS EVENTOS
                    </span>

                    <strong className="dashboard-stat-value">

                        {carregando
                            ? "..."
                            : proximosEventos.length}

                    </strong>

                    <span className="dashboard-stat-description">
                        eventos futuros
                    </span>

                </div>


                {/* =========================
                    HOJE
                ========================= */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        📌
                    </div>

                    <span className="dashboard-stat-label">
                        EVENTOS HOJE
                    </span>

                    <strong className="dashboard-stat-value">

                        {carregando
                            ? "..."
                            : eventosHoje.length}

                    </strong>

                    <span className="dashboard-stat-description">
                        eventos acontecendo hoje
                    </span>

                </div>


                {/* =========================
                    MEUS EVENTOS
                ========================= */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-icon">
                        👤
                    </div>

                    <span className="dashboard-stat-label">
                        MEUS EVENTOS
                    </span>

                    <strong className="dashboard-stat-value">

                        {!autenticado ||
                            carregandoMeusEventos
                            ? "..."
                            : meusEventos}

                    </strong>

                    <span className="dashboard-stat-description">
                        eventos cadastrados por você
                    </span>

                </div>

            </div>


            {/* =========================
                PRÓXIMOS EVENTOS
            ========================= */}

            <div className="dashboard-section">

                <div className="dashboard-section-header">

                    <div>

                        <h3>
                            Próximos eventos
                        </h3>

                        <p>
                            Eventos futuros ordenados por data.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="dashboard-secondary-button"
                        onClick={() =>
                            navigate("/eventos")
                        }
                    >
                        Ver todos
                    </button>

                </div>


                {/* =========================
                    CARREGANDO
                ========================= */}

                {carregando && (

                    <div className="dashboard-empty">

                        <p>
                            Carregando eventos...
                        </p>

                    </div>

                )}


                {/* =========================
                    NENHUM EVENTO
                ========================= */}

                {!carregando &&
                    !erro &&
                    proximosEventos.length === 0 && (

                        <div className="dashboard-empty">

                            <div className="dashboard-empty-icon">
                                📅
                            </div>

                            <h4>
                                Nenhum próximo evento
                            </h4>

                            <p>
                                Não existem eventos futuros cadastrados.
                            </p>


                            {autenticado && (

                                <button
                                    type="button"
                                    className="dashboard-primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/eventos/novo"
                                        )
                                    }
                                >
                                    Novo evento
                                </button>

                            )}

                        </div>

                    )}


                {/* =========================
                    LISTA
                ========================= */}

                {!carregando &&
                    !erro &&
                    proximosEventosExibidos.length > 0 && (

                        <div className="dashboard-events">

                            {proximosEventosExibidos.map(
                                (evento) => (

                                    <button
                                        type="button"
                                        className="dashboard-event"
                                        key={evento.id}
                                        onClick={() =>
                                            navigate(
                                                `/eventos/${evento.id}`
                                            )
                                        }
                                    >

                                        {/* =========================
                                            IMAGEM
                                        ========================= */}

                                        <div className="dashboard-event-image">

                                            {evento.imagem ? (

                                                <img
                                                    src={evento.imagem}
                                                    alt=""
                                                />

                                            ) : (

                                                <span>
                                                    Sem imagem
                                                </span>

                                            )}

                                        </div>


                                        {/* =========================
                                            CONTEÚDO
                                        ========================= */}

                                        <div className="dashboard-event-content">

                                            <strong>
                                                {evento.nomeEvento}
                                            </strong>

                                            <span>
                                                📅{" "}
                                                {formatarData(
                                                    evento.data
                                                )}
                                            </span>

                                            <span>
                                                🕐{" "}
                                                {formatarHora(
                                                    evento.hora
                                                )}
                                            </span>

                                            <span>
                                                📍{" "}
                                                {evento.local}
                                            </span>


                                            {/* ADMINISTRADOR */}

                                            {autenticado &&
                                                evento.administradorNome && (

                                                    <span>
                                                        👤 Criado por:{" "}
                                                        {
                                                            evento.administradorNome
                                                        }
                                                    </span>

                                                )}

                                        </div>


                                        {/* =========================
                                            SETA
                                        ========================= */}

                                        <span className="dashboard-event-arrow">
                                            →
                                        </span>

                                    </button>

                                )
                            )}

                        </div>

                    )}

            </div>

        </section>
    );
}

export default Dashboard;