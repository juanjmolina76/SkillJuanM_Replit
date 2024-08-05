document.querySelector('body').onload = async() => {
    const res = await fetch (`http://localhost:8080/proy/Digitales`)
    const datos = await res.json()
    let ListaHTML = document.querySelector(`#tabla`)  
    ListaHTML.innerHTML = ''
        datos.forEach(registro => {
            ListaHTML.innerHTML += `
            <form method="POST" action="/proy?_metodo=DELETE style="display flex"
                <body>
                    <td>${registro.nombre}</td>
                    <td>${registro.descripcion}</td>
                    <td>${registro.precio}</td>
                    <td>${registro.img}</td>
                    <td>${registro.id_tipo}</td>
                    
                    <input type="hidden" name="idEliminar" value="${registro.id}">
                    <td><button><a href="/modificar/${registro.id}">Modificar</a></td>
                    <td><input type="submit" value="Eliminar"></td>
            </form>
            `})
}

