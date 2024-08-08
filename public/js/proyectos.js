document.querySelector('body').onload = async() => {
    const res = await fetch(`http://localhost:8080/proy/Digitales`)
    const datos = await res.json()
    let listaHTML = document.querySelector(`#tabla`)  
    listaHTML.innerHTML = ''
    datos.forEach(registro => {
        listaHTML.innerHTML += `
            <body>
            <form method="POST" action="/proy/:nombre?_metodo=DELETE" style="display: flex">
                 <td>${registro.nombre}</td>
                 <td>${registro.descripcion}</td>
                 <td>${registro.precio}</td>
                 <td>${registro.img}</td>
                 <td>${registro.id_tipo}</td>
                    <input type="hidden" name="idEliminar" value="${registro.id}">
                    <td><button><a href="/modificar/${registro.id}">Modificar</a><br>
                        <!--<button type="button" class="" onclick="eliminarRegistro${registro.id}>"-->
                    <td><input type="submit" value="Eliminar"></td>
            </form>
            </body>`;
        });
}

