
const validarCampos = () => {
  let campos = document.getElementsByClassName("requerido");

  for (let index = 0; index < campos.length; index++) {
    const campo = campos[index];

    if (campo.value === "") {
      campo.setCustomValidity("El campo es obligatorio");
      campo.reportValidity();
      return false;
    } else {
      campo.setCustomValidity("");
      campo.reportValidity();
    }
  }
  return true;
}


//ESTE ES UN onclic() (q es un eventlistener) para que 
//verifique adicionalmente que tengo un token que voy a guardar gracias a ese event listener
    

//si uso express session lo voy a tener que anular xq no voy a usar token paralelamente???: no porque pueden convivir

const login = async () => {
  if(validarCampos()){
    const user = document.querySelector(`[name='user']`).value
    const password = document.querySelector(`[name='password']`).value
    
    const resp = await fetch(`login/login`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }), 
    })
    console.log(resp)//imprime en la consola del navegador
    if(resp.status === 400){
      const{errors} = await resp.json()
      let mensajes = ''
      errors.forEach(error => mensajes += `${error.msg}\n`)
      alert(`Error en login:\n${mensajes}`)
    }
    else if(resp.status === 404){
      alert ("Usuario inválido");
    } else if (resp.status === 401){
      alert ("Password incorrecto")
    }else{
    const data = await resp.json()
    localStorage.setItem("jwt-token", data.token)//nombré el token: jwt-token
    localStorage.setItem("idRol", data.idRol);// **** AGREGADO ****
    window.location.href="/proyectosDigitales.html"
    //resp.redirected('/proyectosDigitales.html')
  }
}  
}