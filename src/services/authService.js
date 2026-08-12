import api from "./api";

export async function login(email, senha) {
    const response = await api.post("/login", {
        email,
        senha,
    });

    const { token } = response.data;

    localStorage.setItem("token", token);

    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}

export function obterToken() {
    return localStorage.getItem("token");
}

export function estaAutenticado() {
    return !!obterToken();
}