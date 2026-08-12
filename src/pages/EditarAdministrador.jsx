import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    buscarPorId,
    editar,
} from "../services/administradorService";

function EditarAdministrador() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        senha: "",
    });

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarAdministrador() {

            try {

                setErro("");

                const administrador = await buscarPorId(id);

                setFormulario({
                    nome: administrador.nome ?? "",
                    email: administrador.email ?? "",
                    senha: "",
                });

            } catch (error) {

                console.error(error);

                if (error.response?.status === 404) {
                    setErro(
                        "Administrador não encontrado."
                    );
                } else {
                    setErro(
                        "Não foi possível carregar o administrador."
                    );
                }

            } finally {

                setCarregando(false);
            }
        }

        carregarAdministrador();

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

            const dados = {
                nome: formulario.nome,
                email: formulario.email,
            };

            if (formulario.senha.trim()) {
                dados.senha = formulario.senha;
            }

            await editar(id, dados);

            navigate(`/administradores/${id}`);

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
                    "Administrador não encontrado."
                );
            } else {
                setErro(
                    "Não foi possível editar o administrador."
                );
            }

        } finally {

            setSalvando(false);
        }
    }

    if (carregando) {

        return (
            <section>
                <h2>Editar Administrador</h2>
                <p>Carregando administrador...</p>
            </section>
        );
    }

    if (erro && !formulario.nome) {

        return (
            <section>

                <h2>Editar Administrador</h2>

                <p>{erro}</p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/administradores")
                    }
                >
                    Voltar para administradores
                </button>

            </section>
        );
    }

    return (
        <section>

            <h2>Editar Administrador</h2>

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
                        Nova senha
                    </label>

                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        value={formulario.senha}
                        onChange={handleChange}
                        minLength={8}
                        maxLength={20}
                        placeholder="Deixe vazio para manter a senha atual"
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
                    onClick={() =>
                        navigate(`/administradores/${id}`)
                    }
                    disabled={salvando}
                >
                    Cancelar
                </button>

            </form>

        </section>
    );
}

export default EditarAdministrador;