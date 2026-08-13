import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    buscarPagina,
} from "../services/administradorService";

import "../styles/Administradores.css";

function Administradores() {

    const navigate = useNavigate();


    /*
     * =========================
     * ADMINISTRADORES
     * =========================
     */

    const [administradores, setAdministradores] = useState([]);

    const [nome, setNome] = useState("");

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");


    /*
     * =========================
     * PAGINAÇÃO
     * =========================
     */

    const [paginaAtual, setPaginaAtual] = useState(0);

    const [totalPaginas, setTotalPaginas] = useState(0);

    const TAMANHO_PAGINA = 6;


    /*
     * =========================
     * CARREGAR ADMINISTRADORES
     * =========================
     */

    async function carregarAdministradores(
        pagina = 0,
        termo = ""
    ) {

        try {

            setErro("");

            setCarregando(true);


            const dados =
                await buscarPagina(
                    pagina,
                    TAMANHO_PAGINA,
                    "nome",
                    termo.trim()
                );


            setAdministradores(
                dados.content || []
            );


            setPaginaAtual(
                dados.number ?? pagina
            );


            setTotalPaginas(
                dados.totalPages ?? 0
            );

        } catch (error) {

            console.error(
                "ERRO AO CARREGAR ADMINISTRADORES:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPOSTA:",
                error.response?.data
            );

            console.error(
                "URL:",
                error.config?.url
            );

            console.error(
                "PARAMETROS:",
                error.config?.params
            );


            setAdministradores([]);

            setPaginaAtual(0);

            setTotalPaginas(0);

            setErro(
                "Não foi possível carregar os administradores."
            );

        } finally {

            setCarregando(false);
        }
    }


    /*
     * =========================
     * BUSCAR
     * =========================
     */

    async function handleBuscar(event) {

        event.preventDefault();


        const termo =
            nome.trim();


        /*
         * Busca vazia
         */

        if (!termo) {

            setPaginaAtual(0);

            await carregarAdministradores(
                0,
                ""
            );

            return;
        }


        /*
         * Busca por nome
         */

        setPaginaAtual(0);

        await carregarAdministradores(
            0,
            termo
        );
    }


    /*
     * =========================
     * LIMPAR BUSCA
     * =========================
     */

    async function limparBusca() {

        setNome("");

        setPaginaAtual(0);

        await carregarAdministradores(
            0,
            ""
        );
    }


    /*
     * =========================
     * MUDAR PÁGINA
     * =========================
     */

    async function mudarPagina(
        novaPagina
    ) {

        if (novaPagina < 0) {
            return;
        }


        if (
            totalPaginas > 0 &&
            novaPagina >= totalPaginas
        ) {
            return;
        }


        await carregarAdministradores(
            novaPagina,
            nome
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }


    /*
     * =========================
     * CARREGAMENTO INICIAL
     * =========================
     */

    useEffect(() => {

        carregarAdministradores(
            0,
            ""
        );

    }, []);


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (
        <section className="administradores-page">


            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="administradores-header">

                <div>

                    <span className="administradores-eyebrow">
                        ADMINISTRAÇÃO
                    </span>

                    <h2>
                        Administradores
                    </h2>

                    <p>
                        Gerencie os administradores do sistema.
                    </p>

                </div>


                <button
                    type="button"
                    className="administradores-primary-button"
                    onClick={() =>
                        navigate(
                            "/administradores/novo"
                        )
                    }
                >
                    + Novo administrador
                </button>

            </div>


            {/* =========================
                BUSCA
            ========================= */}

            <form
                className="administradores-search"
                onSubmit={handleBuscar}
            >

                <div className="administradores-search-input">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Buscar administrador por nome..."
                        value={nome}
                        onChange={(event) =>
                            setNome(
                                event.target.value
                            )
                        }
                    />

                </div>


                <button
                    type="submit"
                    className="administradores-search-button"
                >
                    Buscar
                </button>


                <button
                    type="button"
                    className="administradores-clear-button"
                    onClick={limparBusca}
                >
                    Limpar
                </button>

            </form>


            {/* =========================
                CARREGANDO
            ========================= */}

            {carregando && (

                <div className="administradores-state">

                    <p>
                        Carregando administradores...
                    </p>

                </div>

            )}


            {/* =========================
                ERRO
            ========================= */}

            {erro && (

                <div className="administradores-error">

                    {erro}

                </div>

            )}


            {/* =========================
                NENHUM ADMINISTRADOR
            ========================= */}

            {!carregando &&
                !erro &&
                administradores.length === 0 && (

                    <div className="administradores-state">

                        <div className="administradores-empty-icon">
                            👤
                        </div>

                        <h3>
                            Nenhum administrador encontrado
                        </h3>

                        <p>
                            Tente realizar uma nova busca ou cadastre um administrador.
                        </p>

                    </div>

                )}


            {/* =========================
                LISTA
            ========================= */}

            {!carregando &&
                !erro &&
                administradores.length > 0 && (

                    <div className="administradores-grid">

                        {administradores.map(
                            (administrador) => (

                                <article
                                    className="administrador-card"
                                    key={administrador.id}
                                    onClick={() =>
                                        navigate(
                                            `/administradores/${administrador.id}`
                                        )
                                    }
                                >


                                    {/* AVATAR */}

                                    <div className="administrador-avatar">

                                        {administrador.nome
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    {/* DADOS */}

                                    <div className="administrador-card-content">

                                        <h3>
                                            {administrador.nome}
                                        </h3>

                                        <span>
                                            ✉️{" "}
                                            {administrador.email}
                                        </span>

                                    </div>


                                    {/* SETA */}

                                    <span className="administrador-card-arrow">
                                        →
                                    </span>

                                </article>

                            )
                        )}

                    </div>

                )}


            {/* =========================
                PAGINAÇÃO
            ========================= */}

            {!carregando &&
                !erro &&
                administradores.length > 0 &&
                totalPaginas > 1 && (

                    <div className="administradores-paginacao">


                        <button
                            type="button"
                            className="administradores-paginacao-button"
                            onClick={() =>
                                mudarPagina(
                                    paginaAtual - 1
                                )
                            }
                            disabled={
                                paginaAtual === 0
                            }
                        >
                            ← Anterior
                        </button>


                        <span className="administradores-paginacao-info">

                            Página{" "}

                            <strong>
                                {paginaAtual + 1}
                            </strong>

                            {" "}de{" "}

                            <strong>
                                {totalPaginas}
                            </strong>

                        </span>


                        <button
                            type="button"
                            className="administradores-paginacao-button"
                            onClick={() =>
                                mudarPagina(
                                    paginaAtual + 1
                                )
                            }
                            disabled={
                                paginaAtual >=
                                totalPaginas - 1
                            }
                        >
                            Próxima →
                        </button>

                    </div>

                )}

        </section>
    );
}

export default Administradores;