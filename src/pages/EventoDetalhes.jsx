import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buscarPorId, deletar } from "../services/eventoService";

function EventoDetalhes() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { autenticado } = useAuth();

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
                    setErro("Evento não encontrado.");
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

    if (carregando) {

        return (
            <section>
                <h2>Detalhes do evento</h2>

                <p>
                    Carregando...
                </p>
            </section>
        );
    }

    if (erro && !evento) {

        return (
            <section>

                <h2>Detalhes do evento</h2>

                <p>{erro}</p>

                <button
                    type="button"
                    onClick={() => navigate("/eventos")}
                >
                    Voltar para eventos
                </button>

            </section>
        );
    }

    return (
        <section>

            <button
                type="button"
                onClick={() => navigate("/eventos")}
                disabled={excluindo}
            >
                Voltar para eventos
            </button>

            {autenticado && (
                <>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/eventos/${id}/editar`)
                        }
                        disabled={excluindo}
                    >
                        Editar evento
                    </button>

                    <button
                        type="button"
                        onClick={handleDeletar}
                        disabled={excluindo}
                    >
                        {excluindo
                            ? "Excluindo..."
                            : "Excluir evento"}
                    </button>
                </>
            )}

            {erro && (
                <p>{erro}</p>
            )}

            <h2>
                {evento.nomeEvento}
            </h2>

            {evento.imagem && (
                <img
                    src={evento.imagem}
                    alt={`Imagem do evento ${evento.nomeEvento}`}
                    width="500"
                />
            )}

            <p>
                <strong>Data:</strong>{" "}
                {evento.data}
            </p>

            <p>
                <strong>Hora:</strong>{" "}
                {evento.hora}
            </p>

            <p>
                <strong>Local:</strong>{" "}
                {evento.local}
            </p>

            <p>
                <strong>Descrição:</strong>{" "}
                {evento.descricao || "Não informada."}
            </p>

        </section>
    );
}

export default EventoDetalhes;