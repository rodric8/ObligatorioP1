function eventos() {
    document.querySelector("#btnLogin").addEventListener("click", loginUI);
    document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesionUI);
    document.querySelector("#btnMostrarOfertas").addEventListener("click", mostrarOfertasUI);
    // document.querySelector("#btnAlmacenar").addEventListener("click", almacenarUI);
}

eventos();
let miSistema = new Sistema();
precargarUsuarios();


ocultarTodoUI();

//#region Login

function loginUI() {
    let usu = document.querySelector("#txtUsuario").value;
    let pwd = document.querySelector("#txtContrasenia").value;
    let logueadoOK = miSistema.login(usu, pwd);


    if (logueadoOK) {
        document.querySelector("#divLogin").style.display = "none";
        document.querySelector("#divCerrarSesion").style.display = "block";

        let tipoLogueado = miSistema.usuLogueado.tipo;
        console.log("Usuario logueado:", miSistema.usuLogueado);
        document.querySelector("#lblLogueado").innerText = "Hola, " + miSistema.usuLogueado.nombre + " || Tipo de usuario: (" + tipoLogueado + ")";
        if (tipoLogueado === "postulante") {
            mostrarOpcionesUsuarioUI();
            // forzar visibilidad en caso de fallo por selección de clase
            let divP = document.querySelector("#divPostulante");
            if (divP) divP.style.display = "block";
        }
        if (tipoLogueado === "administrador") {
            mostrarOpcionesAdminUI();
        }
    } else {
        document.querySelector("#divLoginMensajes").innerHTML = "verifique usuario y contraseña";
        console.log(usu + " " + pwd);
    }
}

//#endregion 

function mostrarOpcionesUsuarioUI() {
    let todosLosDivsDeUsuario = document.querySelectorAll(".postulante");

    for (let i = 0; i < todosLosDivsDeUsuario.length; i++) {
        //console.log(todosLosDivsDeUsuario[i]);
        let unDiv = todosLosDivsDeUsuario[i];
        unDiv.style.display = "block"; //a cada div lo oculto
    }

    /*document.querySelector("#divVerOfertas").style.display="block";
    document.querySelector("#divCerrarSesion").style.display="block";*/
}
function mostrarOpcionesAdminUI() {
    let todosLosDivsDeAdmins = document.querySelectorAll(".admin");

    for (let i = 0; i < todosLosDivsDeAdmins.length; i++) {
        let unDiv = todosLosDivsDeAdmins[i];
        unDiv.style.display = "block"; //a cada div lo oculto
    }
    /*document.querySelector("#divAlmacenar").style.display="block";
    document.querySelector("#divCerrarSesion").style.display="block";*/
}

//#region Cerrar sesión

function cerrarSesionUI() {
    //limpiar los campos escritos, las tablas y demás cosas que se hayan mostrado en pantalla
    miSistema.cerrarSesion();
    ocultarTodoUI();
    document.querySelector("#divLogin").style.display = "block";
}

//#endregion

// funciones de utilidad UI

function ocultarTodoUI() {
    ocultarUsuarioUI();
    ocultarAdminUI();
    document.querySelector("#divCerrarSesion").style.display = "none";
    /* document.querySelector("#divAlmacenar").style.display="none";
    document.querySelector("#divVerPeliculas").style.display="none";
    document.querySelector("#divCerrarSesion").style.display="none";*/
}

function ocultarUsuarioUI() {
    let todosLosDivsDeUsuario = document.querySelectorAll(".postulante");
    for (let i = 0; i < todosLosDivsDeUsuario.length; i++) {
        let unDiv = todosLosDivsDeUsuario[i];
        unDiv.style.display = "none";
    }
}

function ocultarAdminUI() {
    let todosLosDivsDeAdmins = document.querySelectorAll(".admin");
    for (let i = 0; i < todosLosDivsDeAdmins.length; i++) {
        let unDiv = todosLosDivsDeAdmins[i];
        unDiv.style.display = "none";
    }
}

function mostrarOfertasUI() {
    let divOfertas = document.querySelector("#divOfertas");
    if (divOfertas) {
        divOfertas.style.display = "block";
    }
}

//#endregion