import api from "./api";

export async function login(email, senha) {

    const response = await api.post("/login", {
        email,
        senha,
    });

    const {
        token,
        administrador,
    } = response.data;

    localStorage.setItem(
        "token",
        token
    );

    localStorage.setItem(
        "administrador",
        JSON.stringify(administrador)
    );

    return response.data;
}


export function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem(
        "administrador"
    );
}


export function obterToken() {

    return localStorage.getItem("token");
}


export function obterAdministrador() {

    const administrador =
        localStorage.getItem("administrador");

    if (!administrador) {
        return null;
    }

    try {

        return JSON.parse(administrador);

    } catch (error) {

        console.error(
            "Não foi possível recuperar os dados do administrador.",
            error
        );

        localStorage.removeItem(
            "administrador"
        );

        return null;
    }
}


export function estaAutenticado() {

    return !!obterToken();
}