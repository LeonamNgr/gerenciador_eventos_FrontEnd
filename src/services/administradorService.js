import api from "./api";


export async function buscarTodos() {

    const response =
        await api.get("/administradores");

    return response.data;
}


export async function buscarPorId(id) {

    const response =
        await api.get(
            `/administradores/${id}`
        );

    return response.data;
}


export async function buscarPorNome(nome) {

    const response =
        await api.get(
            "/administradores",
            {
                params: {
                    nome,
                },
            }
        );

    return response.data;
}


export async function buscarPagina(
    page = 0,
    size = 6,
    sort = "nome",
    nome = ""
) {

    const response =
        await api.get(
            "/administradores/pagina",
            {
                params: {
                    page,
                    size,
                    sort,
                    ...(nome && { nome }),
                },
            }
        );

    return response.data;
}


export async function cadastrar(administrador) {

    const response =
        await api.post(
            "/administradores",
            administrador
        );

    return response.data;
}


export async function editar(
    id,
    administrador
) {

    const response =
        await api.put(
            `/administradores/${id}`,
            administrador
        );

    return response.data;
}


export async function alterarSenha(
    dados
) {

    await api.patch(
        "/administradores/senha",
        dados
    );
}


export async function deletar(id) {

    await api.delete(
        `/administradores/${id}`
    );
}