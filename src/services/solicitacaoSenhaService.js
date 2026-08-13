import api from "./api";

export async function solicitarAlteracaoSenha(email) {
    await api.post("/solicitacoes-senha", {
        email,
    });
}

export async function buscarSolicitacoesPendentes() {
    const response =
        await api.get("/solicitacoes-senha");

    return response.data;
}

export async function atenderSolicitacaoSenha(
    id,
    novaSenha,
    confirmarNovaSenha
) {
    await api.patch(
        `/solicitacoes-senha/${id}`,
        {
            novaSenha,
            confirmarNovaSenha,
        }
    );
}