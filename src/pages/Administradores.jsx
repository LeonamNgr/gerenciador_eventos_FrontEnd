import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    buscarPorNome,
    buscarTodos,
} from "../services/administradorService";

function Administradores() {

    const navigate = useNavigate();

    const [administradores, setAdministradores] = useState([]);
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarAdministradores() {

        try {

            setErro("");
            setCarregando(true);

            const dados = await buscarTodos();

            setAdministradores(dados);

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível carregar os administradores."
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
                await carregarAdministradores();
                return;
            }

            const dados = await buscarPorNome(nome);

            setAdministradores(dados);

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
        carregarAdministradores();
    }

    useEffect(() => {
        carregarAdministradores();
    }, []);

    return (
        <section>

            <h2>Administradores</h2>

            <button
                type="button"
                onClick={() =>
                    navigate("/administradores/novo")
                }
            >
                Novo Administrador
            </button>

            <form onSubmit={handleBuscar}>

                <input
                    type="text"
                    placeholder="Buscar administrador por nome"
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
                <p>Carregando administradores...</p>
            )}

            {erro && (
                <p>{erro}</p>
            )}

            {!carregando &&
                !erro &&
                administradores.length === 0 && (
                    <p>
                        Nenhum administrador encontrado.
                    </p>
                )}

            {!carregando &&
                !erro &&
                administradores.length > 0 && (

                    <ul>

                        {administradores.map((administrador) => (

                            <li key={administrador.id}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/administradores/${administrador.id}`
                                        )
                                    }
                                >

                                    <strong>
                                        {administrador.nome}
                                    </strong>

                                    <div>
                                        E-mail:{" "}
                                        {administrador.email}
                                    </div>

                                </button>

                            </li>

                        ))}

                    </ul>
                )}

        </section>
    );
}

export default Administradores;