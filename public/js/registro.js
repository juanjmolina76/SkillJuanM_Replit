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

const registro = async () => {
    if(validarCampos()){
      const user = document.querySelector(`[name='user']`).value
      const email = document.querySelector(`[name='email']`).value
      const password = document.querySelector(`[name='password']`).value
      
      const resp = await fetch(`registro/registro`, { //login/login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, email , password }), 
      })
      console.log(resp)//imprime en la consola del navegador
      if(resp.status === 400){
        const{errors} = await resp.json()
        let mensajes = ''
        errors.forEach(error => mensajes += `${error.msg}\n`)
        alert(`Error en registro:\n${mensajes}`)
      }
      /*else if(resp.status === 404){
        alert ("Usuario es inválido");*/
      } else if (resp.status === 401){
        alert ("Password es incorrecto")
      }else{
      const data = await resp.json()
      localStorage.setItem("jwt-token", data.token)//nombré el token: jwt-token
      localStorage.setItem("idRol", data.idRol);// **** AGREGADO ****
      window.location.href="/proyectosDigitales.html"
      //resp.redirected('/proyectosDigitales.html')
    }
}
}