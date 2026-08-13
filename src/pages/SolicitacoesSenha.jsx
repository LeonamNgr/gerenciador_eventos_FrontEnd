import { useEffect, useState } from "react";

import {
    atenderSolicitacaoSenha,
    buscarSolicitacoesPendentes,
} from "../services/solicitacaoSenhaService";

import "../styles/SolicitacoesSenha.css";

function SolicitacoesSenha() {
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [solicitacoes, setSolicitacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
        useState(null);

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

    const [salvando, setSalvando] = useState(false);
    const [erroAtendimento, setErroAtendimento] = useState("");

    async function carregarSolicitacoes() {

        try {

            setErro("");
            setCarregando(true);

            const dados =
                await buscarSolicitacoesPendentes();

            setSolicitacoes(dados);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                setErro(
                    "Sua sessão expirou. Faça login novamente."
                );

            } else {

                setErro(
                    "Não foi possível carregar as solicitações."
                );
            }

        } finally {

            setCarregando(false);
        }
    }

    useEffect(() => {

        carregarSolicitacoes();

    }, []);


    function abrirAtendimento(solicitacao) {

        setSolicitacaoSelecionada(solicitacao);

        setNovaSenha("");
        setConfirmarNovaSenha("");
        setErroAtendimento("");
    }


    function fecharAtendimento() {

        if (salvando) {
            return;
        }

        setSolicitacaoSelecionada(null);

        setNovaSenha("");
        setConfirmarNovaSenha("");
        setErroAtendimento("");
    }


    async function handleAtender(event) {

        event.preventDefault();

        if (!solicitacaoSelecionada) {
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {

            setErroAtendimento(
                "A nova senha e a confirmação da senha não conferem."
            );

            return;
        }

        if (novaSenha.length < 8) {

            setErroAtendimento(
                "A senha deve ter pelo menos 8 caracteres."
            );

            return;
        }

        try {

            setErroAtendimento("");
            setSalvando(true);

            await atenderSolicitacaoSenha(
                solicitacaoSelecionada.id,
                novaSenha,
                confirmarNovaSenha
            );

            fecharAtendimento();

            await carregarSolicitacoes();

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                setErroAtendimento(
                    "Sua sessão expirou. Faça login novamente."
                );

            } else if (error.response?.status === 400) {

                setErroAtendimento(
                    error.response?.data?.mensagem ||
                    "Não foi possível atender a solicitação."
                );

            } else if (error.response?.status === 404) {

                setErroAtendimento(
                    "Solicitação não encontrada."
                );

            } else {

                setErroAtendimento(
                    "Não foi possível alterar a senha."
                );
            }

        } finally {

            setSalvando(false);
        }
    }


    return (
        <section className="solicitacoes-senha-page">

            {/* =========================
                CABEÇALHO
            ========================= */}

            <div className="solicitacoes-senha-header">

                <div>

                    <span className="solicitacoes-senha-eyebrow">
                        SEGURANÇA
                    </span>

                    <h2>
                        Solicitações de senha
                    </h2>

                    <p>
                        Gerencie as solicitações de alteração
                        de senha dos administradores.
                    </p>

                </div>

                <button
                    type="button"
                    className="solicitacoes-senha-refresh"
                    onClick={carregarSolicitacoes}
                    disabled={carregando}
                >
                    Atualizar
                </button>

            </div>


            {/* =========================
                CARREGANDO
            ========================= */}

            {carregando && (

                <div className="solicitacoes-senha-state">

                    <p>
                        Carregando solicitações...
                    </p>

                </div>

            )}


            {/* =========================
                ERRO
            ========================= */}

            {!carregando && erro && (

                <div className="solicitacoes-senha-error">

                    {erro}

                </div>

            )}


            {/* =========================
                NENHUMA SOLICITAÇÃO
            ========================= */}

            {!carregando &&
                !erro &&
                solicitacoes.length === 0 && (

                    <div className="solicitacoes-senha-state">

                        <div className="solicitacoes-senha-empty-icon">
                            ✓
                        </div>

                        <h3>
                            Nenhuma solicitação pendente
                        </h3>

                        <p>
                            Não existem solicitações de alteração
                            de senha aguardando atendimento.
                        </p>

                    </div>

                )}


            {/* =========================
                LISTA
            ========================= */}

            {!carregando &&
                !erro &&
                solicitacoes.length > 0 && (

                    <div className="solicitacoes-senha-list">

                        {solicitacoes.map(
                            (solicitacao) => (

                                <article
                                    className="solicitacao-senha-card"
                                    key={solicitacao.id}
                                >

                                    <div className="solicitacao-senha-avatar">

                                        {solicitacao.administradorNome
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    <div className="solicitacao-senha-info">

                                        <h3>
                                            {solicitacao.administradorNome}
                                        </h3>

                                        <p>
                                            {solicitacao.administradorEmail}
                                        </p>

                                        <span>
                                            Solicitação #{solicitacao.id}
                                        </span>

                                    </div>


                                    <div className="solicitacao-senha-action">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                abrirAtendimento(
                                                    solicitacao
                                                )
                                            }
                                        >
                                            Atender
                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}


            {/* =========================
                MODAL
            ========================= */}

            {solicitacaoSelecionada && (

                <div
                    className="solicitacoes-senha-modal-overlay"
                    onClick={fecharAtendimento}
                >

                    <div
                        className="solicitacoes-senha-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="solicitacoes-senha-modal-header">

                            <div>

                                <span>
                                    ALTERAÇÃO DE SENHA
                                </span>

                                <h3>
                                    Atender solicitação
                                </h3>

                            </div>

                            <button
                                type="button"
                                onClick={fecharAtendimento}
                                disabled={salvando}
                            >
                                ×
                            </button>

                        </div>


                        <div className="solicitacoes-senha-user">

                            <strong>
                                {solicitacaoSelecionada.administradorNome}
                            </strong>

                            <span>
                                {solicitacaoSelecionada.administradorEmail}
                            </span>

                        </div>


                        {erroAtendimento && (

                            <div className="solicitacoes-senha-error">

                                {erroAtendimento}

                            </div>

                        )}


                        <form
                            className="solicitacoes-senha-form"
                            onSubmit={handleAtender}
                        >

                            <div className="solicitacoes-senha-field">

                                <label htmlFor="novaSenha">
                                    Nova senha
                                </label>

                                <div className="senha-input-container">

                                    <input
                                        id="novaSenha"
                                        type={mostrarNovaSenha ? "text" : "password"}
                                        value={novaSenha}
                                        onChange={(event) =>
                                            setNovaSenha(event.target.value)
                                        }
                                        minLength={8}
                                        maxLength={20}
                                        autoComplete="new-password"
                                        required
                                        disabled={salvando}
                                    />

                                    <button
                                        type="button"
                                        className="senha-toggle"
                                        onClick={() =>
                                            setMostrarNovaSenha(!mostrarNovaSenha)
                                        }
                                        disabled={salvando}
                                    >
                                        {mostrarNovaSenha ? "Ocultar" : "Mostrar"}
                                    </button>

                                </div>

                            </div>


                            <div className="solicitacoes-senha-field">

                                <label htmlFor="confirmarNovaSenha">
                                    Confirmar nova senha
                                </label>

                                <div className="senha-input-container">

                                    <input
                                        id="confirmarNovaSenha"
                                        type={mostrarConfirmacao ? "text" : "password"}
                                        value={confirmarNovaSenha}
                                        onChange={(event) =>
                                            setConfirmarNovaSenha(event.target.value)
                                        }
                                        minLength={8}
                                        maxLength={20}
                                        autoComplete="new-password"
                                        required
                                        disabled={salvando}
                                    />

                                    <button
                                        type="button"
                                        className="senha-toggle"
                                        onClick={() =>
                                            setMostrarConfirmacao(!mostrarConfirmacao)
                                        }
                                        disabled={salvando}
                                    >
                                        {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                                    </button>

                                </div>

                            </div>


                            <div className="solicitacoes-senha-modal-actions">

                                <button
                                    type="button"
                                    onClick={fecharAtendimento}
                                    disabled={salvando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={salvando}
                                >
                                    {salvando
                                        ? "Alterando..."
                                        : "Alterar senha"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default SolicitacoesSenha;