import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    buscarPorNome,
    buscarTodos,
} from "../services/eventoService";

function Eventos() {

    const navigate = useNavigate();

    const [eventos, setEventos] = useState([]);
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarEventos() {

        try {

            setErro("");
            setCarregando(true);

            const dados = await buscarTodos();

            setEventos(dados);

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

        try {

            setErro("");
            setCarregando(true);

            if (!nome.trim()) {
                await carregarEventos();
                return;
            }

            const dados = await buscarPorNome(nome);

            setEventos(dados);

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível realizar a busca."
            );

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
        <section>

            <h2>Eventos</h2>

            <button
                type="button"
                onClick={() => navigate("/eventos/novo")}
            >
                Novo Evento
            </button>

            <form onSubmit={handleBuscar}>

                <input
                    type="text"
                    placeholder="Buscar evento por nome"
                    value={nome}
                    onChange={(event) =>
                        setNome(event.target.value)
                    }
                />

                <button type="submit">
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={limparBusca}
                >
                    Limpar
                </button>

            </form>

            {carregando && (
                <p>Carregando eventos...</p>
            )}

            {erro && (
                <p>{erro}</p>
            )}

            {!carregando &&
                !erro &&
                eventos.length === 0 && (
                    <p>
                        Nenhum evento encontrado.
                    </p>
                )}

            {!carregando &&
                !erro &&
                eventos.length > 0 && (

                    <ul>

                        {eventos.map((evento) => (

                            <li key={evento.id}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/eventos/${evento.id}`
                                        )
                                    }
                                >

                                    {evento.imagem && (
                                        <img
                                            src={evento.imagem}
                                            alt={`Imagem do evento ${evento.nomeEvento}`}
                                            width="300"
                                        />
                                    )}

                                    <strong>
                                        {evento.nomeEvento}
                                    </strong>

                                    <div>
                                        Data: {evento.data}
                                    </div>

                                    <div>
                                        Hora: {evento.hora}
                                    </div>

                                    <div>
                                        Local: {evento.local}
                                    </div>

                                </button>

                            </li>

                        ))}

                    </ul>
                )}

        </section>
    );
}

export default Eventos;