function eventos() {
    document.querySelector("#btnLogin").addEventListener("click", loginUI);
    document.querySelector("#btnRegistro").addEventListener("click", mostrarRegistroUI);
    document.querySelector("#btnRegistroConfirm").addEventListener("click", registrarUsuarioUI);
    document.querySelector("#btnVolver").addEventListener("click", voltearALoginUI);
    document.querySelector("#btnCerrarSesion").addEventListener("click", cerrarSesionUI);
    document.querySelector("#btnMostrarOfertas").addEventListener("click", mostrarOfertasUI);
    document.querySelector("#btnMostrarOfertasDestacadas").addEventListener("click", mostrarOfertasDestacadasUI);
    document.querySelector("#btnMostrarMisPostulaciones").addEventListener("click", mostrarMisPostulacionesUI);
    document.querySelector("#btnCrearOferta").addEventListener("click", crearOfertaUI);
    document.querySelector("#btnMostrarOfertasAdmin").addEventListener("click", mostrarOfertasAdminUI);
    document.querySelector("#txtFiltroPro").addEventListener("keyup", filtroUI);

}

eventos();
let miSistema = new Sistema();
precargarUsuarios();
ofertas();
// No precargar postulaciones al iniciar para que "Mis postulaciones" quede vacía
// postulaciones();

ocultarTodoUI();

function filtroUI() {
    let filtro = this.value != null ? this.value.toString().trim().toLowerCase() : "";
    let tabla = document.querySelector("#tblOfertasBody");
    let divOfertas = document.querySelector("#divOfertas");
    if (!tabla || !divOfertas) {
        return;
    }

    divOfertas.style.display = "block";
    tabla.innerHTML = "";

    for (let i = 0; i < miSistema.ofertasLaborales.length; i++) {
        let oferta = miSistema.ofertasLaborales[i];
        let nombreMatch = filtro === "" || oferta.nombre.toLowerCase().includes(filtro);

        if (oferta.estado === "activo" && miSistema.cumplNivelRequerido(miSistema.usuLogueado.nivel, oferta.nivel) && nombreMatch) {
            tabla.innerHTML += `
            <tr>
                <td>${oferta.nombre}</td>
                <td>${oferta.descripcion}</td>
                <td>${oferta.empresa}</td>
                <td>${oferta.nivel}</td>
                <td>${oferta.vacantes}</td>
                <td>${oferta.postulantes}</td>
                <td>${oferta.estado}</td>
                <td><button data-id="${oferta.id}" onclick="postularseAOfertaUI('${oferta.id}')">Postularse</button></td>
            </tr>`; 
        }
    }
}

//#region Login

function loginUI() {
    let usu = document.querySelector("#txtUsuario").value;
    let pwd = document.querySelector("#txtContrasenia").value;
    let logueadoOK = miSistema.login(usu, pwd);


    if (logueadoOK) {
        document.querySelector("#divLogin").style.display = "none";
        document.querySelector("#divCerrarSesion").style.display = "block";

        document.querySelector("#divImagen").style.display = "none";

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

// #region Registrar usuario

function mostrarRegistroUI() {
    document.querySelector("#divLogin").style.display = "none";
    document.querySelector("#divRegistro").style.display = "block";
}

function voltearALoginUI() {
    document.querySelector("#divRegistro").style.display = "none";
    document.querySelector("#divLogin").style.display = "block";
    document.querySelector("#divRegistroMensajes").innerHTML = "";
}

function registrarUsuarioUI() {
    let usuario = document.querySelector("#txtRegUsuario").value;
    let contrasenia = document.querySelector("#txtRegContrasenia").value;
    let nombre = document.querySelector("#txtRegNombre").value;
    let tipo = "postulante";
    let nivel = document.querySelector("#selRegNivel").value;

    if (miSistema.tengoAlgo(usuario) && miSistema.tengoAlgo(contrasenia) && miSistema.tengoAlgo(nombre) && miSistema.tengoAlgo(nivel)) {
        let usuarioExiste = miSistema.usuarios.some(u => u.usuario === usuario.toLowerCase().trim());
        if (usuarioExiste) {
            document.querySelector("#divRegistroMensajes").innerHTML = "El usuario ya existe";
        } else {
            let exito = miSistema.registrarUsuario(usuario, contrasenia, nombre, tipo, nivel);
            if (exito) {
                document.querySelector("#divRegistroMensajes").innerHTML = "Usuario registrado correctamente. Volviendo a Login...";
                setTimeout(() => {
                    document.querySelector("#txtRegUsuario").value = "";
                    document.querySelector("#txtRegContrasenia").value = "";
                    document.querySelector("#txtRegNombre").value = "";
                    document.querySelector("#selRegNivel").value = "";
                    voltearALoginUI();
                }, 2000);
            } else {
                document.querySelector("#divRegistroMensajes").innerHTML = "Error al registrar usuario";
            }
        }
    } else {
        document.querySelector("#divRegistroMensajes").innerHTML = "Complete todos los campos";
    }
}


//VALIDACIONES DE USUARIO Y CONTRASEÑA <<<<-------

//#endregion









// #endregion   

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
    let btnMostrarOfertasAdmin = document.querySelector("#btnMostrarOfertasAdmin");
    if (btnMostrarOfertasAdmin) {
        btnMostrarOfertasAdmin.style.display = "inline-block";
    }
}

//#region Cerrar sesión

function cerrarSesionUI() {
    //limpiar los campos escritos, las tablas y demás cosas que se hayan mostrado en pantalla
    miSistema.cerrarSesion();
    ocultarTodoUI();
    document.querySelector("#divLogin").style.display = "block";
    document.querySelector("#divImagen").style.display = "block";
}

//#endregion

// funciones de utilidad UI

function ocultarTodoUI() {
    ocultarUsuarioUI();
    ocultarAdminUI();
    let btnMostrarOfertasAdmin = document.querySelector("#btnMostrarOfertasAdmin");
    if (btnMostrarOfertasAdmin) {
        btnMostrarOfertasAdmin.style.display = "none";
    }
    document.querySelector("#divCerrarSesion").style.display = "none";
    document.querySelector("#divOfertas").style.display = "none";
    document.querySelector("#divOfertaDestacada").style.display = "none";
    document.querySelector("#divMisPostulaciones").style.display = "none";

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

//#region Mostrar ofertas

function mostrarOfertasUI() {
    let divOfertas = document.querySelector("#divOfertas");
    divOfertas.style.display = "block";

    let tabla = document.querySelector("#tblOfertasBody");
    tabla.innerHTML = "";

    for (let i = 0; i < miSistema.ofertasLaborales.length; i++) {

        let oferta = miSistema.ofertasLaborales[i];

        // Filtrar: solo mostrar si el postulante cumple el nivel requerido y la oferta está activa
        if (oferta.estado === "activo" && miSistema.cumplNivelRequerido(miSistema.usuLogueado.nivel, oferta.nivel)) {

            tabla.innerHTML += `
            <tr>
                <td>${oferta.nombre}</td>
                <td>${oferta.descripcion}</td>
                <td>${oferta.empresa}</td>
                <td>${oferta.nivel}</td>
                <td>${oferta.vacantes}</td>
                <td>${oferta.postulantes}</td>
                <td>${oferta.estado}</td>
                <td><button data-id="${oferta.id}" onclick="postularseAOfertaUI('${oferta.id}')">Postularse</button></td>
            </tr>`;
        }
    }
}

function mostrarOfertasDestacadasUI() {
    let divOfertaDestacada = document.querySelector("#divOfertaDestacada");
    if (divOfertaDestacada) {
        divOfertaDestacada.style.display = "block";
    }

    let tabla = document.querySelector("#tblOfertaDestacadaBody");
    tabla.innerHTML = "";

    for (let i = 0; i < miSistema.ofertasLaborales.length; i++) {

        let oferta = miSistema.ofertasLaborales[i];

        // Filtrar: solo mostrar si está destacada, activa y el postulante cumple el nivel requerido
        if (oferta.destacada && oferta.estado === "activo" && miSistema.cumplNivelRequerido(miSistema.usuLogueado.nivel, oferta.nivel)) {

            tabla.innerHTML += `
            <tr>
                <td>${oferta.nombre}</td>
                <td>${oferta.descripcion}</td>
                <td>${oferta.empresa}</td>
                <td>${oferta.nivel}</td>
                <td>${oferta.vacantes}</td>
                <td>${oferta.postulantes}</td>
                <td>${oferta.estado}</td>
                <td><button data-id="${oferta.id}" onclick="postularseAOfertaUI('${oferta.id}')">Postularse</button></td>
            </tr>`;
        }
    }
}

function mostrarMisPostulacionesUI() {
    let divMisPostulaciones = document.querySelector("#divMisPostulaciones");
    divMisPostulaciones.style.display = "block";

    let tabla = document.querySelector("#tblMisPostulacionesBody");
    tabla.innerHTML = "";

    let misOfertas = miSistema.obtenerMisOfertasPostuladas();

    if (misOfertas.length === 0) {
        tabla.innerHTML = "<tr><td colspan='7' style='text-align: center;'>No tienes postulaciones</td></tr>";
        return;
    }

    for (let i = 0; i < misOfertas.length; i++) {
        let oferta = misOfertas[i];

        tabla.innerHTML += `
            <tr>
                <td>${oferta.nombre}</td>
                <td>${oferta.descripcion}</td>
                <td>${oferta.empresa}</td>
                <td>${oferta.nivel}</td>
                <td>${oferta.vacantes}</td>
                <td>${oferta.postulantes}</td>
                <td>${oferta.estado}</td>
            </tr>`;
    }
}


//#endregion

//#region funciones postu

function postularseAOfertaUI(idOferta) {
    let exito = miSistema.postularseAOferta(idOferta);
    let oferta = miSistema.ofertasLaborales.find(o => o.id === idOferta);
    if (oferta && Number(oferta.postulantes) === Number(oferta.vacantes)) {
        oferta.estado = "inactivo";
    }
    let mensaje = "";
    if (exito) {
        mensaje = `Se postuló a la oferta correctamente`;
        console.log(`Se postuló a la oferta con id: ${idOferta}`);
    } else {
        mensaje = `Error al postularse a la oferta`;
        console.log(`Error al postularse a la oferta con id: ${idOferta}`);
    }
    alert(mensaje);
    //actualizo activas
    mostrarOfertasUI();
}


function crearOfertaUI() {
    let mensaje = "Error, revisar.";
    let titulo = document.querySelector("#txtTitulo").value;
    let nombre = document.querySelector("#txtNombre").value;
    let descripcion = document.querySelector("#txtDesc").value;
    let nivel = document.querySelector("#selNivel").value;
    let area = document.querySelector("#selArea").value;
    let limitePostulaciones = document.querySelector("#limPost").value;
    let cantVacantes = document.querySelector("#cantVacantes").value;
    let destacada = document.querySelector("#cbDestacada").checked;
    // Validaciones

    if (miSistema.tengoAlgo(titulo) && miSistema.tengoAlgo(nombre) && miSistema.tengoAlgo(descripcion) && miSistema.tengoAlgo(nivel) && miSistema.tengoAlgo(cantVacantes)) {
        let vacantes = Number(cantVacantes);
        let limite = Number(limitePostulaciones);

        if (!isNaN(vacantes) && vacantes > 0 && limite >= vacantes) {
            // generar un id para la oferta
            let idOF = "JOB_OFFER_" + (miSistema.ofertasLaborales.length + 1);
            let postulantes = 0;
            let estado = "activo";
            miSistema.guardarOferta(idOF, titulo, descripcion, nombre, nivel, vacantes, postulantes, estado, destacada);
            mensaje = "Se guardó la oferta correctamente.";
            // limpiar formulario despues de crear oferta
            document.querySelector("#txtTitulo").value = "";
            document.querySelector("#txtNombre").value = "";
            document.querySelector("#txtDesc").value = "";
            document.querySelector("#selNivel").value = " ";
            document.querySelector("#selArea").value = " ";
            document.querySelector("#limPost").value = "";
            document.querySelector("#cantVacantes").value = "";
            document.querySelector("#cbDestacada").checked = false;
        } else {
            if (limite < vacantes) {
                mensaje = "El límite de postulaciones no puede ser menor a la cantidad de vacantes.";
            } else {
                mensaje = "Cantidad de vacantes inválida.";
            }
        }
    } else {
        mensaje = "Complete todos los campos.";
    }

    document.querySelector("#divMostrar").innerHTML = mensaje;
}

//Dejar esto abajo para mostrar que se actualizan las ofertas al crear una nueva oferta o al postularse 
function cargarOfertasActivasUI() {
    let tablaOfertas = miSistema.cargarOfertasActivas();
    document.querySelector("#divOfertas").innerHTML = tablaOfertas;
}

// #endregion
function mostrarOfertasAdminUI() {
    let divAdmin = document.querySelector("#divAdmin");
    if (divAdmin) {
        divAdmin.style.display = "block";
    }
}
