import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authProvider"
import API_BASE_URL from "../assets/config"


function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const { setUsuario, setAutenticado } = useAuth()

    async function registrarUsuario(registro) {
        try {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registro.email)) {
                alert("Correo invalido")
                return
            }
            if (registro.clave.length < 4) {
                alert("La contraseña debe tener minimo 4 caracteres")
                return
            }
            const promesa = await fetch(`${API_BASE_URL}/peliculas/usuarios/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registro),
                credentials: "include"
            })
            if (promesa.status === 201) {
                const respuesta = await promesa.json()
                setUsuario(respuesta)
                setAutenticado(true)
                alert("Usuario registrado exitosamente")
                navigate("/profile")
            } else if (promesa.status === 401) {
                throw new Error("El email ya corresponde a un usuario");
            } else {
                throw new Error("Ocurrio un problema con el servidor en el proceso de registro");
            }
        } catch (error) {
            alert(error.message)
            console.log(error)
        }
    }

    return (
        <div className="mt-40 text-base xs:text-2xl p-8">
            <h2 className="text-3xl xs:text-4xl mb-2">Registro de usuario</h2>
            <form onSubmit={handleSubmit(async (values) => {
                await registrarUsuario(values)
            })}>
                <input type="email" {...register("email", { required: true })} placeholder="Correo electronico" className="border border-double mt-2 focus:outline-none" /><br></br>
                {errors.email && <p className="text-amber-200 mt-2">Ingrese correo electronico</p>}

                <input type="text" {...register("nombre", { required: true })} placeholder="Nombre" className="border border-double mt-2 focus:outline-none" /><br></br>
                {errors.nombre && <p className="text-amber-200 mt-2">Ingrese nombre</p>}

                <input type="password" {...register("clave", { required: true })} placeholder="Contraseña" className="border border-double mt-2 focus:outline-none" /><br></br>
                {errors.clave && <p className="text-amber-200 mt-2">Ingrese contraseña</p>}
                <button className="cursor-pointer border rounded-lg mt-2 p-2 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-sm xs:text-base">Registrar</button>
            </form>
            <Link to={"/"} className="underline">Iniciar Sesion</Link>
        </div>
    )
}

export default RegisterPage;