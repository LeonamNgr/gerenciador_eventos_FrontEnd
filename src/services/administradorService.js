import api from "./api";

export async function buscarTodos() {
    const response = await api.get("/administradores");

    return response.data;
}

export async function buscarPorId(id) {
    const response = await api.get(`/administradores/${id}`);

    return response.data;
}

export async function buscarPorNome(nome) {
    const response = await api.get("/administradores", {
        params: {
            nome,
        },
    });

    return response.data;
}

export async function cadastrar(administrador) {
    const response = await api.post(
        "/administradores",
        administrador
    );

    return response.data;
}

export async function editar(id, administrador) {
    const response = await api.put(
        `/administradores/${id}`,
        administrador
    );

    return response.data;
}

export async function deletar(id) {
    await api.delete(`/administradores/${id}`);
}