import { useAuth } from "../context/authProvider";
import API_BASE_URL from "../assets/config";


function HeaderProfile() {
    const { usuario, setUsuario, setAutenticado } = useAuth()

    async function cerrarSesion() {
        try {
            const promesa = await fetch(`${API_BASE_URL}/peliculas/usuarios/profile/logout`, {
                method: "DELETE",
                credentials: "include"
            })
            if (promesa.status === 200) {
                setUsuario(null)
                setAutenticado(false)
            } else {
                throw new Error("Ha ocurrido un problema con el servidor");

            }
        } catch (error) {
            alert(error.message)
            setUsuario(null)
            setAutenticado(false)
        }
    }

    async function eliminarCuenta() {
        const confirmar = window.confirm("¿Esta seguro que desea eliminar su cuenta?")
        if (confirmar) {
            try {
                const promesa = await fetch(`${API_BASE_URL}/peliculas/usuarios/profile/delete`, {
                    method: "DELETE",
                    credentials: "include"
                })
                if (promesa.status === 200) {
                    const eliminarDatos = await fetch(`${API_BASE_URL}/peliculas/funcionalidades`, {
                        method: "DELETE",
                        credentials: "include"
                    })
                    if (eliminarDatos.status === 200 || eliminarDatos.status === 401) {
                        alert("Cuenta eliminada correctamente")
                        cerrarSesion()
                    } else {
                        throw new Error("Su cuenta ha sido eliminada y los datos seran eliminados por el servidor");
                    }
                } else {
                    throw new Error("Ocurrio un problema con el servidor, intente mas tarde");

                }
            } catch (error) {
                alert(error.message)
            }
        }
    }
    return (
        <div className="flex flex-wrap justify-between md:mx-25 mx-5 mt-5 items-center p-5 border rounded-lg bg-white text-red-700">
            <span>Perfil: {usuario.nombre} </span>
            <div className="flex flex-col">
                <button onClick={eliminarCuenta} className="cursor-pointer border rounded-lg mt-2 p-2 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-[8px] xs:text-sm sm:text-base">Eliminar Cuenta</button>
                <button onClick={cerrarSesion} className="cursor-pointer border rounded-lg mt-2 p-2 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-[8px] xs:text-sm sm:text-base">Cerrar sesion</button>
            </div>
        </div>
    )
}

export default HeaderProfile;