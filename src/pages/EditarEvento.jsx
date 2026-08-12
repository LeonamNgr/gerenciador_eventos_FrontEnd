import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    buscarPorId,
    editar,
} from "../services/eventoService";

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

    function handleChange(event) {

        const { name, value } = event.target;

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: value,
        }));
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

    if (carregando) {

        return (
            <section>
                <h2>Editar Evento</h2>
                <p>Carregando evento...</p>
            </section>
        );
    }

    if (erro && !formulario.nomeEvento) {

        return (
            <section>

                <h2>Editar Evento</h2>

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

            <h2>Editar Evento</h2>

            {erro && (
                <p>{erro}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
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

                <div>
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

                <div>
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

                <div>
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

                <div>
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
                </div>

                <div>
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
                </div>

                <button
                    type="submit"
                    disabled={salvando}
                >
                    {salvando
                        ? "Salvando..."
                        : "Salvar alterações"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/eventos/${id}`)}
                    disabled={salvando}
                >
                    Cancelar
                </button>

            </form>

        </section>
    );
}

export default EditarEvento;
