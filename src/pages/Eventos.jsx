import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    buscarPorId,
    buscarPorNome,
    buscarTodos,
} from "../services/eventoService";

import {
    formatarData,
    formatarHora,
} from "../utils/formatadores";

import "../styles/Eventos.css";

function Eventos() {

    const navigate = useNavigate();

    const { autenticado } = useAuth();

    const [eventos, setEventos] = useState([]);
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    function ordenarPorData(lista) {

        return [...lista].sort((a, b) => {

            if (!a.data) {
                return 1;
            }

            if (!b.data) {
                return -1;
            }

            const dataA = new Date(
                `${a.data}T00:00:00`
            );

            const dataB = new Date(
                `${b.data}T00:00:00`
            );

            return dataA - dataB;
        });
    }

    async function carregarEventos() {

        try {

            setErro("");
            setCarregando(true);

            const dados = await buscarTodos();

            setEventos(
                ordenarPorData(dados)
            );

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível carregar os eventos."
            );

        } finally {

            setCarregando(false);
        }
    }

    async function handleBuscar(event) {

        event.preventDefault();

        const termo = nome.trim();

        if (!termo) {

            await carregarEventos();

            return;
        }

        try {

            setErro("");
            setCarregando(true);

            /*
             * Se o usuário digitou somente números,
             * a busca será realizada pelo ID.
             */
            if (/^\d+$/.test(termo)) {

                const dados = await buscarPorId(termo);

                setEventos(
                    ordenarPorData([dados])
                );

                return;
            }

            /*
             * Caso contrário,
             * a busca será realizada pelo nome.
             */
            const dados = await buscarPorNome(termo);

            setEventos(
                ordenarPorData(dados)
            );

        } catch (error) {

            console.error(error);

            if (error.response?.status === 404) {

                setEventos([]);

                setErro(
                    "Nenhum evento encontrado."
                );

            } else {

                setEventos([]);

                setErro(
                    "Não foi possível realizar a busca."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    function limparBusca() {

        setNome("");

        carregarEventos();
    }

    useEffect(() => {

        carregarEventos();

    }, []);

    return (
        <section className="eventos-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="eventos-header">

                <div>

                    <span className="eventos-eyebrow">
                        PROGRAMAÇÃO
                    </span>

                    <h2>
                        Eventos
                    </h2>

                    <p>
                        Encontre eventos e confira todos os detalhes.
                    </p>

                </div>

                {autenticado && (

                    <button
                        type="button"
                        className="evento-primary-button"
                        onClick={() =>
                            navigate("/eventos/novo")
                        }
                    >
                        + Novo evento
                    </button>

                )}

            </div>


            {/* =========================
                BUSCA
            ========================= */}

            <form
                className="eventos-search"
                onSubmit={handleBuscar}
            >

                <div className="search-input-wrapper">

                    <span className="search-icon">
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Buscar por nome ou ID..."
                        value={nome}
                        onChange={(event) =>
                            setNome(event.target.value)
                        }
                    />

                </div>

                <button
                    type="submit"
                    className="search-button"
                >
                    Buscar
                </button>

                <button
                    type="button"
                    className="clear-button"
                    onClick={limparBusca}
                >
                    Limpar
                </button>

            </form>


            {/* =========================
                CARREGANDO
            ========================= */}

            {carregando && (

                <div className="eventos-state">

                    <p>
                        Carregando eventos...
                    </p>

                </div>

            )}


            {/* =========================
                ERRO
            ========================= */}

            {erro && (

                <div className="eventos-state eventos-error">

                    <p>
                        {erro}
                    </p>

                </div>

            )}


            {/* =========================
                NENHUM EVENTO
            ========================= */}

            {!carregando &&
                !erro &&
                eventos.length === 0 && (

                    <div className="eventos-state">

                        <h3>
                            Nenhum evento encontrado
                        </h3>

                        <p>
                            Tente buscar pelo nome ou pelo ID do evento.
                        </p>

                    </div>

                )}


            {/* =========================
                LISTA DE EVENTOS
            ========================= */}

            {!carregando &&
                !erro &&
                eventos.length > 0 && (

                    <div className="eventos-grid">

                        {eventos.map((evento) => (

                            <article
                                className="evento-card"
                                key={evento.id}
                                onClick={() =>
                                    navigate(
                                        `/eventos/${evento.id}`
                                    )
                                }
                            >

                                {/* IMAGEM */}

                                <div className="evento-image-wrapper">

                                    {evento.imagem ? (

                                        <img
                                            src={evento.imagem}
                                            alt={`Imagem do evento ${evento.nomeEvento}`}
                                            className="evento-image"
                                        />

                                    ) : (

                                        <div className="evento-image-placeholder">

                                            <span>
                                                Sem imagem
                                            </span>

                                        </div>

                                    )}

                                </div>


                                {/* INFORMAÇÕES */}

                                <div className="evento-card-content">

                                    <h3>
                                        {evento.nomeEvento}
                                    </h3>


                                    <div className="evento-info">

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


                                    <span className="evento-details">
                                        Ver detalhes →
                                    </span>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

        </section>
    );
}

export default Eventos;