const verificarToken = async () => {
    const token = localStorage.getItem('jwt-token')

    const res = await fetch(`/login/verificarToken/${token}`)

    if (!res.ok) {
        window.location.href = "/login.html"
        throw Error("Problemas en login")
    }
}


verificarToken()
/*
/*   **** YA TENGO EL LOGOUT EN login.js ***
const logout = async () => {
    localStorage.removeItem("jwt-token")

    window.location.href = "/login.html"

   
}
*/


//solo si es admin (id_rol = 1) puede ver el ABM de Productos
const idRol = localStorage.getItem('idRol')
let solo_Admin = document.getElementById("solo_Admin")

if (idRol == 2 && solo_Admin != null && idRol !== 1) {
    solo_Admin.hidden = true   
}


//solo si es admin pueden ir al ABM de Productos o al modificar
/*
const pathActual = window.location.pathname;


if (idRol == 2 && (pathActual == '/producto' || pathActual.includes('/modificar/') || pathActual == '/bienvenido')) {
    window.location.href = "/index.html";
    alert("El usuario no tiene acceso al recurso 🚧🚫");

}

*/