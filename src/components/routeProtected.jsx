import {Outlet,Navigate} from "react-router-dom"
import { useAuth } from "../context/authProvider";


function ProtectedRoute(){
    const {autenticado}= useAuth()

    return(
        autenticado ? <Outlet />: <Navigate to={"/"} />
    )
}

export default ProtectedRoute;