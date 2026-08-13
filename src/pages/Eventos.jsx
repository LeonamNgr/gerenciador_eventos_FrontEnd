import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    buscarPagina,
    buscarPorId,
    cadastrar,
} from "../services/eventoService";

import {
    formatarData,
    formatarHora,
} from "../utils/formatadores";

import "../styles/Eventos.css";

function Eventos() {

    const navigate = useNavigate();

    const { autenticado } = useAuth();

    /*
     * =========================
     * EVENTOS
     * =========================
     */

    const [eventos, setEventos] = useState([]);

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
     * MODAL
     * =========================
     */

    const [modalAberto, setModalAberto] = useState(false);

    const [salvando, setSalvando] = useState(false);

    const [erroCadastro, setErroCadastro] = useState("");

    const [formulario, setFormulario] = useState({
        nomeEvento: "",
        data: "",
        hora: "",
        local: "",
        descricao: "",
        imagem: "",
    });


    /*
     * =========================
     * CARREGAR EVENTOS
     * =========================
     */

    async function carregarEventos(
        pagina = 0,
        termo = ""
    ) {

        try {

            setErro("");

            setCarregando(true);

            const dados = await buscarPagina(
                pagina,
                TAMANHO_PAGINA,
                "data",
                termo.trim()
            );

            console.log(
                "Resposta da paginação:",
                dados
            );

            setEventos(
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
                "ERRO AO CARREGAR EVENTOS:",
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

            setEventos([]);

            setTotalPaginas(0);

            setErro(
                "Não foi possível carregar os eventos."
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

        const termo = nome.trim();


        /*
         * Busca vazia
         */

        if (!termo) {

            setPaginaAtual(0);

            await carregarEventos(
                0,
                ""
            );

            return;
        }


        /*
         * Busca por ID
         */

        if (/^\d+$/.test(termo)) {

            try {

                setErro("");

                setCarregando(true);

                const evento = await buscarPorId(
                    termo
                );

                setEventos([
                    evento,
                ]);

                setPaginaAtual(0);

                setTotalPaginas(1);

            } catch (error) {

                console.error(
                    "ERRO AO BUSCAR EVENTO POR ID:",
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

                setEventos([]);

                setPaginaAtual(0);

                setTotalPaginas(0);

                if (
                    error.response?.status === 404
                ) {

                    setErro(
                        "Nenhum evento encontrado."
                    );

                } else {

                    setErro(
                        "Não foi possível realizar a busca."
                    );
                }

            } finally {

                setCarregando(false);
            }

            return;
        }


        /*
         * Busca por nome
         */

        setPaginaAtual(0);

        await carregarEventos(
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

        await carregarEventos(
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

        await carregarEventos(
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
     * ABRIR MODAL
     * =========================
     */

    function abrirModal() {

        setErroCadastro("");

        setFormulario({
            nomeEvento: "",
            data: "",
            hora: "",
            local: "",
            descricao: "",
            imagem: "",
        });

        setModalAberto(true);
    }


    /*
     * =========================
     * FECHAR MODAL
     * =========================
     */

    function fecharModal() {

        if (salvando) {
            return;
        }

        setModalAberto(false);

        setErroCadastro("");
    }


    /*
     * =========================
     * ALTERAR FORMULÁRIO
     * =========================
     */

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;

        setFormulario(
            (estadoAnterior) => ({
                ...estadoAnterior,
                [name]: value,
            })
        );

        setErroCadastro("");
    }


    /*
     * =========================
     * CADASTRAR EVENTO
     * =========================
     */

    async function handleCadastrar(event) {

        event.preventDefault();

        try {

            setErroCadastro("");

            setSalvando(true);

            await cadastrar(
                formulario
            );

            setModalAberto(false);

            setFormulario({
                nomeEvento: "",
                data: "",
                hora: "",
                local: "",
                descricao: "",
                imagem: "",
            });

            /*
             * Recarrega a página atual.
             */

            await carregarEventos(
                paginaAtual,
                nome
            );

        } catch (error) {

            console.error(
                "ERRO AO CADASTRAR EVENTO:",
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

            if (
                error.response?.status === 400
            ) {

                setErroCadastro(
                    "Verifique os dados informados."
                );

            } else if (
                error.response?.status === 401
            ) {

                setErroCadastro(
                    "Sua sessão expirou. Faça login novamente."
                );

            } else {

                setErroCadastro(
                    "Não foi possível cadastrar o evento."
                );
            }

        } finally {

            setSalvando(false);
        }
    }


    /*
     * =========================
     * CARREGAMENTO INICIAL
     * =========================
     */

    useEffect(() => {

        carregarEventos(
            0,
            ""
        );

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
                        onClick={abrirModal}
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
                            setNome(
                                event.target.value
                            )
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
                EVENTOS
            ========================= */}

            {!carregando &&
                !erro &&
                eventos.length > 0 && (

                    <div className="eventos-grid">

                        {eventos.map(
                            (evento) => (

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
                                                src={
                                                    evento.imagem
                                                }
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


                                    {/* CONTEÚDO */}

                                    <div className="evento-card-content">

                                        <h3>
                                            {
                                                evento.nomeEvento
                                            }
                                        </h3>


                                        <div className="evento-info">

                                            <span>
                                                📅{" "}
                                                {
                                                    formatarData(
                                                        evento.data
                                                    )
                                                }
                                            </span>

                                            <span>
                                                🕐{" "}
                                                {
                                                    formatarHora(
                                                        evento.hora
                                                    )
                                                }
                                            </span>

                                            <span>
                                                📍{" "}
                                                {
                                                    evento.local
                                                }
                                            </span>


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

                            )
                        )}

                    </div>

                )}


            {/* =========================
                PAGINAÇÃO
            ========================= */}

            {!carregando &&
                !erro &&
                eventos.length > 0 &&
                totalPaginas > 1 && (

                    <div className="eventos-paginacao">

                        <button
                            type="button"
                            className="eventos-paginacao-button"
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


                        <span className="eventos-paginacao-info">

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
                            className="eventos-paginacao-button"
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


            {/* ==================================================
                MODAL
            ================================================== */}

            {modalAberto && (

                <div
                    className="evento-modal-overlay"
                    onClick={fecharModal}
                >

                    <div
                        className="evento-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* CABEÇALHO */}

                        <div className="evento-modal-header">

                            <div>

                                <span className="evento-modal-eyebrow">
                                    NOVO CADASTRO
                                </span>

                                <h3>
                                    Adicionar evento
                                </h3>

                                <p>
                                    Preencha os dados do evento.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="evento-modal-close"
                                onClick={fecharModal}
                                disabled={salvando}
                                aria-label="Fechar"
                            >
                                ×
                            </button>

                        </div>


                        {/* ERRO DO CADASTRO */}

                        {erroCadastro && (

                            <div className="evento-modal-error">

                                {erroCadastro}

                            </div>

                        )}


                        {/* FORMULÁRIO */}

                        <form
                            className="evento-modal-form"
                            onSubmit={
                                handleCadastrar
                            }
                        >


                            {/* NOME */}

                            <div className="evento-modal-field">

                                <label htmlFor="modal-nomeEvento">
                                    Nome do evento
                                </label>

                                <input
                                    id="modal-nomeEvento"
                                    name="nomeEvento"
                                    type="text"
                                    value={
                                        formulario.nomeEvento
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={200}
                                    required
                                    autoFocus
                                />

                            </div>


                            {/* DATA E HORA */}

                            <div className="evento-modal-row">

                                <div className="evento-modal-field">

                                    <label htmlFor="modal-data">
                                        Data
                                    </label>

                                    <input
                                        id="modal-data"
                                        name="data"
                                        type="date"
                                        value={
                                            formulario.data
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="evento-modal-field">

                                    <label htmlFor="modal-hora">
                                        Hora
                                    </label>

                                    <input
                                        id="modal-hora"
                                        name="hora"
                                        type="time"
                                        value={
                                            formulario.hora
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* LOCAL */}

                            <div className="evento-modal-field">

                                <label htmlFor="modal-local">
                                    Local
                                </label>

                                <input
                                    id="modal-local"
                                    name="local"
                                    type="text"
                                    value={
                                        formulario.local
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={200}
                                    required
                                />

                            </div>


                            {/* DESCRIÇÃO */}

                            <div className="evento-modal-field">

                                <label htmlFor="modal-descricao">
                                    Descrição
                                </label>

                                <textarea
                                    id="modal-descricao"
                                    name="descricao"
                                    value={
                                        formulario.descricao
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={2000}
                                    required
                                />

                            </div>


                            {/* IMAGEM */}

                            <div className="evento-modal-field">

                                <label htmlFor="modal-imagem">
                                    URL da imagem
                                </label>

                                <input
                                    id="modal-imagem"
                                    name="imagem"
                                    type="url"
                                    value={
                                        formulario.imagem
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={500}
                                    placeholder="https://..."
                                />

                                <span>
                                    Campo opcional.
                                </span>

                            </div>


                            {/* AÇÕES */}

                            <div className="evento-modal-actions">

                                <button
                                    type="button"
                                    className="evento-modal-cancel"
                                    onClick={
                                        fecharModal
                                    }
                                    disabled={
                                        salvando
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="evento-modal-submit"
                                    disabled={
                                        salvando
                                    }
                                >
                                    {salvando
                                        ? "Cadastrando..."
                                        : "Cadastrar evento"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default Eventos;