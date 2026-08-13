import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    estaAutenticado,
    obterAdministrador,
    login as realizarLogin,
    logout as realizarLogout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [autenticado, setAutenticado] = useState(
        estaAutenticado()
    );

    const [administrador, setAdministrador] = useState(
        obterAdministrador()
    );

    async function login(email, senha) {

        const response =
            await realizarLogin(
                email,
                senha
            );

        setAutenticado(true);

        setAdministrador(
            response.administrador
        );

        return response;
    }

    function logout() {

        realizarLogout();

        setAutenticado(false);

        setAdministrador(null);
    }

    return (
        <AuthContext.Provider
            value={{
                autenticado,
                administrador,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth deve ser utilizado dentro de um AuthProvider."
        );
    }

    return context;
}