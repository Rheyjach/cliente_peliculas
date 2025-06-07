import { useState, useEffect, useContext, createContext } from "react";
import API_BASE_URL from "../assets/config";

const authContext = createContext()

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [autenticado, setAutenticado] = useState(false)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        async function verificarPerfil() {
            try {
                const promesa = await fetch(`${API_BASE_URL}/peliculas/usuarios/profile`, {
                    method: "GET",
                    credentials: "include"
                })
                if (promesa.status === 200) {
                    const respuesta = await promesa.json()
                    setUsuario(respuesta)
                    setAutenticado(true)
                } else {
                    setUsuario(null)
                    setAutenticado(false)
                }
            } catch (error) {
                console.error(`Error al verificar token ${error.message}`)
                setUsuario(null)
                setAutenticado(false)
            } finally {
                setCargando(false)
            }
        }
        verificarPerfil()
    }
        , [])

    return (
        <authContext.Provider value={{ usuario, setUsuario, autenticado, setAutenticado }}>
            {!cargando && children}
        </authContext.Provider>
    )
}

export function useAuth(){
    return useContext(authContext)
}