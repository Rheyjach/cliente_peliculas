import API_BASE_URL from "./config";

/* Obtener datos de usuario*/

export async function obtenerDatos() {
    try {
        const promesa = await fetch(`${API_BASE_URL}/peliculas/funcionalidades`, {
            method: "GET",
            credentials: "include"
        })
        if (promesa.status === 200) {
            const respuesta = await promesa.json()
            return respuesta
        } else {
            throw new Error("No se pudo obtener la informacion de la base de datos");
        }
    } catch (error) {
        alert(error.message)
    }
}

/* Agregar peliculas*/
export async function ingresarDatos(pelicula) {
    try {
        const promesa = await fetch(`${API_BASE_URL}/peliculas/funcionalidades`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula),
            credentials: "include"
        })
        if (promesa.status === 201) {
            const respuesta= await promesa.json()
            return respuesta
        }else{
            throw new Error("No se pudo agregar la informacion a la base de datos");
        }
    } catch (error) {
        alert(error.message)
    }
}

/* Eliminar datos*/

export async function eliminarDatos(id) {
    try {
        const promesa = await fetch(`${API_BASE_URL}/peliculas/funcionalidades/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        if (promesa.status === 200) {
            const respuesta= await promesa.json()
            return respuesta
        }else{
            throw new Error("No se pudo eliminar la informacion de la base de datos");
        }
    } catch (error) {
        alert(error.message)
    }
}

/* Actualizar datos*/
export async function actualizarDatos(id,pelicula) {
    try {
        const promesa = await fetch(`${API_BASE_URL}/peliculas/funcionalidades/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula),
            credentials: "include"
        })
        if (promesa.status === 200) {
            const respuesta= await promesa.json()
            return respuesta
        }else{
            throw new Error("No se pudo actualizar la informacion de la base de datos");
        }
    } catch (error) {
        alert(error.message)
    }
}