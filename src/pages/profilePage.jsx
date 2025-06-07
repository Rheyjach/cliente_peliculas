import HeaderProfile from "../components/headerProfile"
import { useState, useEffect, useRef } from "react";
import { obtenerDatos, ingresarDatos, eliminarDatos, actualizarDatos } from "../assets/apiProfile.js";

function ProfilePage() {
    /* Referencia de campos de entrada*/
    const referenciaNombre = useRef(null)
    const referenciaPuntuacion = useRef(null)
    const referenciaCategoria = useRef(null)

    /* Estados*/
    const [peliculas, setPeliculas] = useState([])
    const [modoBoton, setModoBoton] = useState("Ingresar")
    const [contenido, setContenido] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [peliculaEditada, setPeliculaEditada] = useState("")



    /* Funciones*/

    /* Inserccion y edicion de datos*/

    async function insertarYeditar() {
        if (modoBoton == "Ingresar") {
            const nombre = referenciaNombre.current.value.trim()
            const puntuacion = referenciaPuntuacion.current.value
            const categoria = referenciaCategoria.current.value

            if (nombre && puntuacion && categoria) {
                if (puntuacion >= 0) {
                    for (let pelicula of peliculas) {
                        if (pelicula.nombre.toLowerCase() == nombre.toLowerCase()) {
                            alert("El nombre de la pelicula ya ha sido ingresado, puede buscarlo en la lista y editarlo")
                            return
                        }
                    }
                    const ingresar = await ingresarDatos({ nombre, puntuacion, categoria })
                    if (ingresar) {
                        const datosActuales = await obtenerDatos()
                        if (datosActuales) {
                            setPeliculas(datosActuales)
                            referenciaNombre.current.value = ""
                            referenciaPuntuacion.current.value = ""
                            alert("Informacion ingresada con exito")
                        }
                    }
                } else {
                    alert("La puntuacion no puede ser un numero negativo, debe ser minimo 0")
                }
            } else {
                alert("Debe rellenar todos los campos para ingresar la información")
            }
        } else {
            const nombreEditado = referenciaNombre.current.value.trim()
            const puntuacionEditada = referenciaPuntuacion.current.value
            const categoriaEditada = referenciaCategoria.current.value
            if (nombreEditado && puntuacionEditada && categoriaEditada) {
                if (puntuacionEditada >= 0) {
                    if (nombreEditado == peliculaEditada.nombre && puntuacionEditada == peliculaEditada.puntuacion && categoriaEditada == peliculaEditada.categoria) {
                        alert("No se ha modificado nada, porque los campos permanecieron igual")
                        setModoBoton("Ingresar")
                        referenciaNombre.current.value = ""
                        referenciaPuntuacion.current.value = ""
                    }

                    const edicion = { nombre: nombreEditado, puntuacion: puntuacionEditada, categoria: categoriaEditada }
                    const actualizar = await actualizarDatos(peliculaEditada._id, edicion)
                    if (actualizar) {
                        const datosActualizados = await obtenerDatos()
                        if (datosActualizados) {
                            referenciaNombre.current.value = ""
                            referenciaPuntuacion.current.value = ""
                            setModoBoton("Ingresar")
                            setPeliculas(datosActualizados)
                            alert("Pelicula editada exitosamente")
                        }
                    }

                } else {
                    alert("La puntuacion no puede ser un numero negativo, debe ser minimo 0")
                }
            } else {
                alert("Debe rellenar todos los campos para actualizar la información")
            }

        }
    }

    /* Eliminar datos*/

    async function eliminarInformacion(id) {
        const data = await eliminarDatos(id)
        if (data) {
            const datosActuales = await obtenerDatos()
            if (datosActuales) {
                setPeliculas(datosActuales)
            }
        }
    }

    /* Activar edicion de datos*/

    function editarDatos(peliculaSeleccionada) {
        setPeliculaEditada(peliculaSeleccionada)
        referenciaNombre.current.value = peliculaSeleccionada.nombre
        referenciaPuntuacion.current.value = peliculaSeleccionada.puntuacion
        referenciaCategoria.current.value = peliculaSeleccionada.categoria
        setModoBoton("Actualizar")
    }

    /*Filtro por categoria*/
    function filtroCategoria(seleccion) {
        setCategoriaSeleccionada(seleccion)
        if (seleccion == "Todas" || seleccion == "") {
            setContenido(peliculas)
        } else {
            const datosFiltrados = peliculas.filter((valor) => valor.categoria == seleccion)
            setContenido(datosFiltrados)
        }
    }

    /* Busqueda por nombre*/

    function busquedaNombre(valor) {
        const datosBuscados = peliculas.filter((item) => item.nombre.includes(valor))
        setContenido(datosBuscados)
    }

    /* Obtener datos Iniciales*/
    useEffect(() => {
        async function datosAlmacenados() {
            const datos = await obtenerDatos() || []
            setPeliculas(datos)
        }
        datosAlmacenados()
    }, [])

    /* Actualizar los datos mostrados sin llamar filtros*/
    useEffect(() => {
        filtroCategoria(categoriaSeleccionada)
    }, [peliculas])

    return (
        <div className="perfil">
            <h1 className="text-base xs:text-2xl sm:text-4xl mt-4">Puntuacion de peliculas</h1>
            <HeaderProfile />
            <h2 className="text-sm xs:text-base sm:text-3xl mt-4 mb-4 underline">Ingresar peliculas</h2>
            <div className="flex flex-wrap justify-center items-center">
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 mx-2"><label className="text-[8px] xs:text-sm sm:text-base mx-2">Nombre</label> <input type="text" ref={referenciaNombre} className="text-[8px] xs:text-sm sm:text-base border border-double mr-2 w-40 focus:outline-none" /></div>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 mx-2"><label className="text-[8px] xs:text-sm sm:text-base mx-2">Puntuacion</label> <input type="number" ref={referenciaPuntuacion} className="text-[8px] xs:text-sm sm:text-base border border-double mr-2 w-40 focus:outline-none" /></div>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 mx-2"><label className="text-[8px] xs:text-sm sm:text-base mx-2">Categoria</label>
                    <select ref={referenciaCategoria} className="border border-double focus:outline-none focus:bg-red-700 text-[8px] xs:text-sm sm:text-base mr-2">
                        <option value="Fantasia">Fantasia</option>
                        <option value="Accion">Accion</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Super Heroes">Super Heroes</option>
                        <option value="Romance">Romance</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Terror">Terror</option>
                        <option value="Otro">Otro</option>
                    </select></div>
                <button onClick={insertarYeditar} className="cursor-pointer border rounded-lg mt-2 p-1 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-[8px] xs:text-sm sm:text-base max-h-8">{modoBoton}</button>
            </div>
            <Filtros funcionFiltro={filtroCategoria} funcionBusqueda={busquedaNombre} />
            <Mostrar peliculas={contenido} funcionEliminar={eliminarInformacion} funcionEditar={editarDatos} />
        </div>
    )
}

export default ProfilePage;


function Filtros({ funcionFiltro, funcionBusqueda }) {
    return (
        <div>
            <h2 className="text-sm xs:text-base sm:text-3xl mt-4 underline">Seleccionar Filtro</h2>

            <div className="flex flex-wrap justify-center">
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 mx-2"><label className="text-[8px] xs:text-sm sm:text-base mx-2">Filtro por categoria</label>
                    <select onChange={(e) => funcionFiltro(e.target.value)} className="border border-double focus:outline-none focus:bg-red-700 text-[8px] xs:text-sm sm:text-base mr-2">
                        <option value="Todas">Todas</option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Accion">Accion</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Super Heroes">Super Heroes</option>
                        <option value="Romance">Romance</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Terror">Terror</option>
                        <option value="Otro">Otro</option>
                    </select></div>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 mx-2"><label className="text-[8px] xs:text-sm sm:text-base mx-2">Busqueda por nombre</label><input type="text" onInput={(e) => funcionBusqueda(e.target.value)} className="text-[8px] xs:text-sm sm:text-base border border-double mr-2 w-40 focus:outline-none" /></div>
            </div>
        </div>
    )
}


function Mostrar({ peliculas, funcionEliminar, funcionEditar }) {
    return (
        <div className="border mt-3 mb-3 rounded-lg mx-5 md:mx-25 text-red-700 bg-white">
            <h2 className="text-sm xs:text-base sm:text-3xl mt-4 underline">Peliculas ingresadas</h2>
            <ul className="text-[8px] xs:text-[10px] sm:text-sm overflow-x-auto text-center">
                {peliculas.map((valor, index) => {
                    return (
                        <li key={index} className="whitespace-nowrap mt-[4px]">{valor.nombre} - Puntuacion: {valor.puntuacion} - {valor.categoria}
                            <button onClick={() => funcionEliminar(valor._id)} className="cursor-pointer border rounded-lg mt-2 p-1 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-[8px] xs:text-sm sm:text-base mx-1">Eliminar</button>
                            <button onClick={() => funcionEditar(valor)} className="cursor-pointer border rounded-lg mt-2 p-1 focus:outline-none focus:bg-amber-200 focus:text-red-700 text-[8px] xs:text-sm sm:text-base mx-1">Editar</button></li>
                    )
                })}
            </ul>
            <h3 className="text-[10px] xs:text-sm sm:text-base mt-4 mb-4 underline">Puntaje Promedio: {peliculas.length > 0 ? (peliculas.reduce((acumulador, pelicula) => acumulador + Number(pelicula.puntuacion), 0) / peliculas.length).toFixed(2) : "0.00"}</h3>
        </div>
    )
}