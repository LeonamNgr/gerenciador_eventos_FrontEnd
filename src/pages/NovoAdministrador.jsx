import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrar } from "../services/administradorService";

function NovoAdministrador() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
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

        try {

            setErro("");
            setCarregando(true);

            await cadastrar(formulario);

            navigate("/administradores");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {
                setErro(
                    "Verifique os dados informados."
                );
            } else if (error.response?.status === 401) {
                setErro(
                    "Você não possui autorização para cadastrar um administrador."
                );
            } else {
                setErro(
                    "Não foi possível cadastrar o administrador."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    return (
        <section>

            <h2>Novo Administrador</h2>

            {erro && (
                <p>{erro}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="nome">
                        Nome
                    </label>

                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formulario.nome}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">
                        E-mail
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formulario.email}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="senha">
                        Senha
                    </label>

                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        value={formulario.senha}
                        onChange={handleChange}
                        minLength={8}
                        maxLength={20}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={carregando}
                >
                    {carregando
                        ? "Cadastrando..."
                        : "Cadastrar administrador"}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/administradores")
                    }
                    disabled={carregando}
                >
                    Cancelar
                </button>

            </form>

        </section>
    );
}

export default NovoAdministrador;