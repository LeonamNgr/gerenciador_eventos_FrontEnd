import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarPorId } from "../services/eventoService";

function EventoDetalhes() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [evento, setEvento] = useState(null);
    const [carregando, setCarregando] = useState(true);
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

    if (carregando) {
        return (
            <section>
                <h2>Detalhes do evento</h2>
                <p>Carregando...</p>
            </section>
        );
    }

    if (erro) {
        return (
            <section>
                <h2>Detalhes do evento</h2>

                <p>{erro}</p>

                <button
                    type="button"
                    onClick={() => navigate("/eventos")}
                >
                    Voltar
                </button>
            </section>
        );
    }

    return (
        <section>

            <button
                type="button"
                onClick={() => navigate("/eventos")}
            >
                Voltar para eventos
            </button>

            <h2>{evento.nomeEvento}</h2>

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