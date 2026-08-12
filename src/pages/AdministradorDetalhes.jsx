import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    buscarPorId,
    deletar,
} from "../services/administradorService";

function AdministradorDetalhes() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [administrador, setAdministrador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function carregarAdministrador() {

            try {

                setErro("");

                const dados = await buscarPorId(id);

                setAdministrador(dados);

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

    async function handleDeletar() {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este administrador?"
        );

        if (!confirmar) {
            return;
        }

        try {

            setErro("");
            setExcluindo(true);

            await deletar(id);

            navigate("/administradores", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            if (error.response?.status === 400) {
                setErro(
                    "Não é possível excluir este administrador."
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
                    "Não foi possível excluir o administrador."
                );
            }

        } finally {

            setExcluindo(false);
        }
    }

    if (carregando) {

        return (
            <section>
                <h2>Detalhes do administrador</h2>

                <p>
                    Carregando...
                </p>
            </section>
        );
    }

    if (erro && !administrador) {

        return (
            <section>

                <h2>Detalhes do administrador</h2>

                <p>{erro}</p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/administradores")
                    }
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
                onClick={() =>
                    navigate("/administradores")
                }
                disabled={excluindo}
            >
                Voltar para administradores
            </button>

            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/administradores/${id}/editar`
                    )
                }
                disabled={excluindo}
            >
                Editar administrador
            </button>

            <button
                type="button"
                onClick={handleDeletar}
                disabled={excluindo}
            >
                {excluindo
                    ? "Excluindo..."
                    : "Excluir administrador"}
            </button>

            {erro && (
                <p>{erro}</p>
            )}

            <h2>
                {administrador.nome}
            </h2>

            <p>
                <strong>E-mail:</strong>{" "}
                {administrador.email}
            </p>

        </section>
    );
}

export default AdministradorDetalhes;