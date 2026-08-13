import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    buscarPorId,
    editar,
} from "../services/eventoService";

import "./EditarEvento.css";

function EditarEvento() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nomeEvento: "",
        data: "",
        hora: "",
        local: "",
        descricao: "",
        imagem: "",
    });

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarEvento() {

            try {

                setErro("");
                setCarregando(true);

                const evento = await buscarPorId(id);

                setFormulario({
                    nomeEvento: evento.nomeEvento ?? "",
                    data: evento.data ?? "",
                    hora: evento.hora ?? "",
                    local: evento.local ?? "",
                    descricao: evento.descricao ?? "",
                    imagem: evento.imagem ?? "",
                });

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

    function handleChange(event) {

        const { name, value } = event.target;

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value,
        }));

        setErro("");
    }

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setErro("");
            setSalvando(true);

            await editar(id, formulario);

            navigate(`/eventos/${id}`);

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
                    "Evento não encontrado."
                );

            } else {

                setErro(
                    "Não foi possível editar o evento."
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
            <section className="editar-evento-page">

                <div className="editar-evento-header">

                    <button
                        type="button"
                        className="editar-evento-back"
                        onClick={() => navigate("/eventos")}
                    >
                        ← Voltar para eventos
                    </button>

                    <span className="editar-evento-eyebrow">
                        EVENTOS
                    </span>

                    <h2>
                        Editar Evento
                    </h2>

                    <p>
                        Carregando os dados do evento...
                    </p>

                </div>

                <div className="editar-evento-card">

                    <div className="editar-evento-loading">
                        <div className="editar-evento-spinner"></div>

                        <p>
                            Carregando evento...
                        </p>
                    </div>

                </div>

            </section>
        );
    }


    /* =========================
       EVENTO NÃO ENCONTRADO
    ========================= */

    if (erro && !formulario.nomeEvento) {

        return (
            <section className="editar-evento-page">

                <div className="editar-evento-header">

                    <button
                        type="button"
                        className="editar-evento-back"
                        onClick={() => navigate("/eventos")}
                    >
                        ← Voltar para eventos
                    </button>

                    <span className="editar-evento-eyebrow">
                        EVENTOS
                    </span>

                    <h2>
                        Editar Evento
                    </h2>

                    <p>
                        Não foi possível carregar os dados.
                    </p>

                </div>

                <div className="editar-evento-card">

                    <div className="editar-evento-error-state">

                        <div className="editar-evento-error-icon">
                            !
                        </div>

                        <h3>
                            Não foi possível carregar o evento
                        </h3>

                        <p>
                            {erro}
                        </p>

                        <button
                            type="button"
                            className="editar-evento-submit"
                            onClick={() => navigate("/eventos")}
                        >
                            Voltar para eventos
                        </button>

                    </div>

                </div>

            </section>
        );
    }


    return (
        <section className="editar-evento-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="editar-evento-header">

                <button
                    type="button"
                    className="editar-evento-back"
                    onClick={() =>
                        navigate(`/eventos/${id}`)
                    }
                    disabled={salvando}
                >
                    ← Voltar para detalhes
                </button>

                <span className="editar-evento-eyebrow">
                    EVENTOS
                </span>

                <h2>
                    Editar Evento
                </h2>

                <p>
                    Atualize as informações do evento.
                </p>

            </div>


            {/* =========================
                CARD
            ========================= */}

            <div className="editar-evento-card">

                <div className="editar-evento-card-header">

                    <div className="editar-evento-avatar">
                        ✏️
                    </div>

                    <div>

                        <h3>
                            Dados do evento
                        </h3>

                        <p>
                            Altere as informações que deseja atualizar.
                        </p>

                    </div>

                </div>


                {/* =========================
                    ERRO
                ========================= */}

                {erro && (

                    <div className="editar-evento-error">
                        {erro}
                    </div>

                )}


                {/* =========================
                    FORMULÁRIO
                ========================= */}

                <form
                    className="editar-evento-form"
                    onSubmit={handleSubmit}
                >

                    {/* NOME */}

                    <div className="editar-evento-field">

                        <label htmlFor="nomeEvento">
                            Nome do evento
                        </label>

                        <input
                            id="nomeEvento"
                            name="nomeEvento"
                            type="text"
                            value={formulario.nomeEvento}
                            onChange={handleChange}
                            maxLength={200}
                            required
                        />

                    </div>


                    {/* DATA + HORA */}

                    <div className="editar-evento-row">

                        <div className="editar-evento-field">

                            <label htmlFor="data">
                                Data
                            </label>

                            <input
                                id="data"
                                name="data"
                                type="date"
                                value={formulario.data}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="editar-evento-field">

                            <label htmlFor="hora">
                                Hora
                            </label>

                            <input
                                id="hora"
                                name="hora"
                                type="time"
                                value={formulario.hora}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* LOCAL */}

                    <div className="editar-evento-field">

                        <label htmlFor="local">
                            Local
                        </label>

                        <input
                            id="local"
                            name="local"
                            type="text"
                            value={formulario.local}
                            onChange={handleChange}
                            maxLength={200}
                            required
                        />

                    </div>


                    {/* DESCRIÇÃO */}

                    <div className="editar-evento-field">

                        <label htmlFor="descricao">
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            maxLength={2000}
                            required
                        />

                        <span>
                            Atualize a descrição do evento.
                        </span>

                    </div>


                    {/* IMAGEM */}

                    <div className="editar-evento-field">

                        <label htmlFor="imagem">
                            URL da imagem
                        </label>

                        <input
                            id="imagem"
                            name="imagem"
                            type="url"
                            value={formulario.imagem}
                            onChange={handleChange}
                            maxLength={500}
                        />

                        <span>
                            Campo opcional.
                        </span>

                    </div>


                    {/* AÇÕES */}

                    <div className="editar-evento-actions">

                        <button
                            type="button"
                            className="editar-evento-cancel"
                            onClick={() =>
                                navigate(`/eventos/${id}`)
                            }
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="editar-evento-submit"
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

export default EditarEvento;