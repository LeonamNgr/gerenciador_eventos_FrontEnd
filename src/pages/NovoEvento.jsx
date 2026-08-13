import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { cadastrar } from "../services/eventoService";

import "./NovoEvento.css";

function NovoEvento() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nomeEvento: "",
        data: "",
        hora: "",
        local: "",
        descricao: "",
        imagem: "",
    });

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

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

        setErro("");
        setCarregando(true);

        try {

            await cadastrar(formulario);

            navigate("/eventos");

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

            } else {

                setErro(
                    "Não foi possível cadastrar o evento."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <section className="novo-evento-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="novo-evento-header">

                <button
                    type="button"
                    className="novo-evento-back"
                    onClick={() => navigate("/eventos")}
                    disabled={carregando}
                >
                    ← Voltar para eventos
                </button>

                <span className="novo-evento-eyebrow">
                    EVENTOS
                </span>

                <h2>
                    Novo Evento
                </h2>

                <p>
                    Cadastre um novo evento no sistema.
                </p>

            </div>


            {/* =========================
                CARD
            ========================= */}

            <div className="novo-evento-card">

                <div className="novo-evento-card-header">

                    <div className="novo-evento-avatar">
                        📅
                    </div>

                    <div>

                        <h3>
                            Dados do evento
                        </h3>

                        <p>
                            Informe os dados necessários para cadastrar o evento.
                        </p>

                    </div>

                </div>


                {/* =========================
                    ERRO
                ========================= */}

                {erro && (

                    <div className="novo-evento-error">
                        {erro}
                    </div>

                )}


                {/* =========================
                    FORMULÁRIO
                ========================= */}

                <form
                    className="novo-evento-form"
                    onSubmit={handleSubmit}
                >

                    {/* NOME */}

                    <div className="novo-evento-field">

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
                            placeholder="Digite o nome do evento"
                            required
                        />

                    </div>


                    {/* DATA + HORA */}

                    <div className="novo-evento-row">

                        <div className="novo-evento-field">

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


                        <div className="novo-evento-field">

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

                    <div className="novo-evento-field">

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
                            placeholder="Informe o local do evento"
                            required
                        />

                    </div>


                    {/* DESCRIÇÃO */}

                    <div className="novo-evento-field">

                        <label htmlFor="descricao">
                            Descrição
                        </label>

                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formulario.descricao}
                            onChange={handleChange}
                            maxLength={2000}
                            placeholder="Descreva o evento"
                            required
                        />

                        <span>
                            Descreva os principais detalhes do evento.
                        </span>

                    </div>


                    {/* IMAGEM */}

                    <div className="novo-evento-field">

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
                            placeholder="https://exemplo.com/imagem.jpg"
                        />

                        <span>
                            Campo opcional.
                        </span>

                    </div>


                    {/* AÇÕES */}

                    <div className="novo-evento-actions">

                        <button
                            type="button"
                            className="novo-evento-cancel"
                            onClick={() => navigate("/eventos")}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="novo-evento-submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar evento"}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default NovoEvento;