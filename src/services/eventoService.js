import api from "./api";

export async function buscarTodos() {
    const response = await api.get("/eventos");

    return response.data;
}

export async function buscarPorId(id) {
    const response = await api.get(`/eventos/${id}`);

    return response.data;
}

export async function buscarPorNome(nome) {
    const response = await api.get("/eventos", {
        params: {
            nome,
        },
    });

    return response.data;
}

export async function cadastrar(evento) {
    const response = await api.post("/eventos", evento);

    return response.data;
}

export async function editar(id, evento) {
    const response = await api.put(`/eventos/${id}`, evento);

    return response.data;
}

export async function deletar(id) {
    await api.delete(`/eventos/${id}`);
}

export async function contarMeusEventos() {
    const response = await api.get("/eventos/meus/count");

    return response.data;
}