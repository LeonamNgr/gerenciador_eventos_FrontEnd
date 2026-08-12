import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrar } from "../services/eventoService";

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
        <section>

            <h2>Novo Evento</h2>

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
                    disabled={carregando}
                >
                    {carregando
                        ? "Cadastrando..."
                        : "Cadastrar evento"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/eventos")}
                    disabled={carregando}
                >
                    Cancelar
                </button>

            </form>

        </section>
    );
}

export default NovoEvento;