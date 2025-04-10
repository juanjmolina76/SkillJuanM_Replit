document.querySelector('body').onload = async () => {
	
	const token = localStorage.getItem('jwt-token');
    const idRol = localStorage.getItem('idRol');

	const res = await fetch(`/proy/digitales`, {//en REPLIT eliminar el local host,
        //dejar solo la ruta`/proy/digitales` y en el DOCKER CONTAINER tambien (`http://localhost:8080/proy/digitales`
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	})
    if(!res.ok){
        window.location.href="/login.html"
        throw Error("Problemas en login")
    }  else{

    const datos = await res.json()//lo obteninedo como respuesta es resultado del pedido asincrono que el controlador hace a la bd, 
    let listaHTML = document.querySelector(`#tabla`)  
    listaHTML.innerHTML = ''
    listaHTML.innerHTML = `<thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Precio</th>
                            <!--th>Img</th-->
                            <th>Img</th>
                            <th>id_tipo</th>
                            <th>Editar</th>
                            </tr>
                            </thead>`
    datos.forEach(registro => {
        listaHTML.innerHTML += `
            <body>
            <tr>
                 <td>${registro.nombre}</td>
                 <td>${registro.descripcion}</td>
                 <td>${registro.precio}</td>
                 <!--td><img src="/img/${registro.img} width="20"></td-->
                 <!--td>${registro.img}</td-->
                 <td><img src="/img/${registro.img}" width="50"></td> <!--registro.originalname u registro.img-->
                 <td>${registro.id_tipo}</td>
                    <td >
                    <button><a href="/modificar/${registro.id}">Modificar</a></button><br>
                    ${idRol != 2 ? `
                    <form method="POST" action="/proy/:nombre?_metodo=DELETE" style="display: flex">
                    <input type="hidden" name="idEliminar" value="${registro.id}">        
                    <input type="submit" value="Eliminar">` : ''}</td>
            </form>
            </tr>
            </body>`;
        });
}
}
/* <button type="button" class="" onclick="eliminarRegistro${registro.id}>" */
/* <button><a href="/modificar/${registro.id}">Modificar</a></button><br> */

//const guardarId = (e) => localStorage.setItem(`id`, e.target.id)*/