console.log("hola");

resultado = prompt("Dime tu nombre");

document.write(`<h1 class="grad">Hola ${resultado}</h1>`);

const edad = (d_edad=prompt("Dime tu edad")) =>{
    document.write(`<p>${resultado} nació el año</p>` + (2024 - d_edad));
  }
edad();




/*
console.log(resultado);
let name=("juan");
console.log(name);
*/

// document.write(`<h1 class="grad">Hola ${resultado}</h1>`);

// document.write(`<h1>

let sumaID = document.getElementById('suma');

let sumar=(num1,num2)=>{
  let resultado = num1 + num2;
  return resultado;
}

sumaID.innerHTML += sumar(5,6);


/*INSERTAR DATOS EN TABLA*/


// let table = document.getElementById('skills');

//FUNCION CAPTURAR DATOS. para tomar los datos ingresados en el formulario.
function capturar () {
console.log("capturado");//
function Persona(nombre,apellido,edad,email){
this.nombre = nombre;
this.apellido = apellido;
this.edad = edad;
this.email = email;
}
//se capturan los datos desde el formulario.
var nombreCapturar=document.getElementById("name").value; console.log(nombreCapturar);//
var apellidoCapturar=document.getElementById("apellido").value; console.log(apellidoCapturar);//
var edadCapturar = document.getElementById("edad").value; console.log(edadCapturar);//
var emailCapturar=document.getElementById("email").value; console.log(emailCapturar);//
//se crea un nuevo objeto, nuevoSujeto con los valores capturados.
nuevoSujeto=new Persona(nombreCapturar, apellidoCapturar, edadCapturar, emailCapturar); 
console.log(nuevoSujeto);//
  
//se crea un nuevo objeto y se guarda en el arraay baseDatos 
//al llamar a la funcion (agregar).
agregar();
};

var baseDatos= [];
//funcion agregar, para agregar los datos capturados  en el array 
//baseDatos, e imprimirlos en el navegador en la tabla.
function agregar() {
baseDatos.push(nuevoSujeto); 
console.log(baseDatos);//
document.getElementById("tabla").innerHTML += '<body><td>'+nuevoSujeto.nombre+'</td><td>'+nuevoSujeto.apellido+'</td><td>'+nuevoSujeto.edad+'</td><td>'+nuevoSujeto.email+'</td></body>';
};

//en la consola puedo ver que los datos se guardaron en el array.
//con console.log(baseDatos);
// o bien con console.log(baseDatos[0]); etc..

