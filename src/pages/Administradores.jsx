import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    buscarPorNome,
    buscarTodos,
} from "../services/administradorService";

import "./Administradores.css";

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

        const termo = nome.trim();

        if (!termo) {

            await carregarAdministradores();

            return;
        }

        try {

            setErro("");
            setCarregando(true);

            const dados = await buscarPorNome(termo);

            setAdministradores(dados);

        } catch (error) {

            console.error(error);

            setAdministradores([]);

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
        <section className="administradores-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="administradores-header">

                <div>

                    <span className="administradores-eyebrow">
                        ADMINISTRAÇÃO
                    </span>

                    <h2>
                        Administradores
                    </h2>

                    <p>
                        Gerencie os administradores do sistema.
                    </p>

                </div>

                <button
                    type="button"
                    className="administradores-primary-button"
                    onClick={() =>
                        navigate("/administradores/novo")
                    }
                >
                    + Novo administrador
                </button>

            </div>


            {/* =========================
                BUSCA
            ========================= */}

            <form
                className="administradores-search"
                onSubmit={handleBuscar}
            >

                <div className="administradores-search-input">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Buscar administrador por nome..."
                        value={nome}
                        onChange={(event) =>
                            setNome(event.target.value)
                        }
                    />

                </div>

                <button
                    type="submit"
                    className="administradores-search-button"
                >
                    Buscar
                </button>

                <button
                    type="button"
                    className="administradores-clear-button"
                    onClick={limparBusca}
                >
                    Limpar
                </button>

            </form>


            {/* =========================
                CARREGANDO
            ========================= */}

            {carregando && (

                <div className="administradores-state">

                    <p>
                        Carregando administradores...
                    </p>

                </div>

            )}


            {/* =========================
                ERRO
            ========================= */}

            {erro && (

                <div className="administradores-error">

                    {erro}

                </div>

            )}


            {/* =========================
                NENHUM ADMINISTRADOR
            ========================= */}

            {!carregando &&
                !erro &&
                administradores.length === 0 && (

                    <div className="administradores-state">

                        <div className="administradores-empty-icon">
                            👤
                        </div>

                        <h3>
                            Nenhum administrador encontrado
                        </h3>

                        <p>
                            Tente realizar uma nova busca ou cadastre um administrador.
                        </p>

                    </div>

                )}


            {/* =========================
                LISTA
            ========================= */}

            {!carregando &&
                !erro &&
                administradores.length > 0 && (

                    <div className="administradores-grid">

                        {administradores.map(
                            (administrador) => (

                                <article
                                    className="administrador-card"
                                    key={administrador.id}
                                    onClick={() =>
                                        navigate(
                                            `/administradores/${administrador.id}`
                                        )
                                    }
                                >

                                    {/* AVATAR */}

                                    <div className="administrador-avatar">
                                        {administrador.nome
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>


                                    {/* DADOS */}

                                    <div className="administrador-card-content">

                                        <h3>
                                            {administrador.nome}
                                        </h3>

                                        <span>
                                            ✉️{" "}
                                            {administrador.email}
                                        </span>

                                    </div>


                                    {/* SETA */}

                                    <span className="administrador-card-arrow">
                                        →
                                    </span>

                                </article>

                            )
                        )}

                    </div>

                )}

        </section>
    );
}

export default Administradores;