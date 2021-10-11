// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyB_h7aitfjOVfWp6hCC0IsWjwuSQ_zOw8A",
    authDomain: "lista-tareas-12048.firebaseapp.com",
    projectId: "lista-tareas-12048",
    storageBucket: "lista-tareas-12048.appspot.com",
    messagingSenderId: "653377239572",
    appId: "1:653377239572:web:898bca2337efb0e80e4501"

  };
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

// Variables globales aplicacion


// Asignamos variable para loguear
const auth = firebase.auth();

// Asignamos proovedor para logueo
const proveedor = new firebase.auth.GoogleAuthProvider();

const database = firebase.firestore();

let usuarioActual;

let listaTareas = [];

//Variables DOM y funciones

const btnLogin = document.getElementById('button-login');

const btnOutLogin = document.getElementById('button-logout');

const formulario = document.getElementById('todo-form');

const input = document.getElementById('todo-input');

const contenedorTarea = document.getElementById('todos-container');

async function login() {

    try {
        const respuesta = await auth.signInWithPopup(proveedor);
        console.log(respuesta.user.displayName);
        usuarioActual = respuesta.user;
        listaTareas = await leerTarea();

        pintarBrowser(listaTareas); // funcion para pintar la info en el navegador

    } catch (error) {
        console.error(error);
    }
}


function outLogin(){
    auth.signOut();

}

// base de datos

async function addText(texto){

    const tarea = {

        id : uuid.v4(), // añadimos un id aleatorio utilizando la libreria uuid
        Tarea: texto,
        Completada: false,
        Usuario: usuarioActual.displayName
    }

   const respuesta =  await guardarTarea(tarea);
   console.log(respuesta);
   input.value =  "";
    listaTareas =await leerTarea()
        pintarBrowser(listaTareas);
}


async function guardarTarea(task){

    try {
         const respuesta = await database.collection('lista-tareas').add(task);

        //como es una funcion puedo retornar algo

        return respuesta;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}


async function leerTarea(){
    const tareas = []
    const respuesta = await database.collection('lista-tareas').get();
    respuesta.forEach(function(item)  {
        //console.log(item.data());
        tareas.push(item.data());
    })
    return tareas;
}

// funcio para mostrar info en html

function pintarBrowser(tareas){
    let contenidoHtml = ""

    tareas.forEach((t)=>{
        contenidoHtml += `
        <label>${t.Tarea}</label>
        <br/>`
    })

    contenedorTarea.innerHTML = contenidoHtml;
}



//Eventos

//Se recomienda abrir con un servidor web

btnLogin.addEventListener('click',(e)=>{
    login();
    btnLogin.classList.add('hidden');
    formulario.classList.remove('hidden');
    btnOutLogin.classList.remove('hidden');


})

btnOutLogin.addEventListener('click',(e)=>{

    outLogin();
    btnLogin.classList.remove('hidden');
    formulario.classList.add('hidden');
    btnOutLogin.classList.add('hidden');

})

formulario.addEventListener('submit',(e)=>{
    e.preventDefault(); // Evitamos que la pagina se refresque con el evento
    //console.log(input.value); // atrapamos la entrada del input
    const texto = input.value;
    if (texto != ""){
        addText(texto);
    }
})
