document.querySelector('body').onload = async () => {
	
	const token = localStorage.getItem('jwt-token')

	const res = await fetch(`http://localhost:8080/proy/digitales`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		}
	})
    if(!res.ok){
        window.location.href="/login.html"
        throw Error("Problemas en login")
    }  else{

    const datos = await res.json()
    let listaHTML = document.querySelector(`#tabla`)  
    listaHTML.innerHTML = ''
    datos.forEach(registro => {
        listaHTML.innerHTML += `
            <body>
            <tr>
                 <td>${registro.nombre}</td>
                 <td>${registro.descripcion}</td>
                 <td>${registro.precio}</td>
                 <td><img src="/img/${registro.img} width="50"></td>
                 <td>${registro.img}</td>
                 <td><img src="/img/${registro.img}" width="50"></td>
                 <td>${registro.id_tipo}</td>
                    <td>
                    <button><a href="/modificar/${registro.id}">Modificar</a></button><br>
                    
                    <form method="POST" action="/proy/:nombre?_metodo=DELETE" style="display: flex">
                    <input type="hidden" name="idEliminar" value="${registro.id}">        
                    <input type="submit" value="Eliminar"></td>
            </form>
            </tr>
            </body>`;
        });
}
}
/* <button type="button" class="" onclick="eliminarRegistro${registro.id}>" */
/* <button><a href="/modificar/${registro.id}">Modificar</a></button><br> */

//const guardarId = (e) => localStorage.setItem(`id`, e.target.id)*/