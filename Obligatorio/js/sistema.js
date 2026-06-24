class Sistema {
    constructor() {
        this.usuarios = new Array();
        this.usuLogueado = null;
        this.ofertasLaborales = new Array();
        this.postulaciones = new Array();
    }


    guardarUsuarioPostulante(UsuP, PwdP, NombreP, TipoP, NivelP = "junior") {

        let usuP;

        usuP = new Postulante();

        usuP.usuario = UsuP != null ? UsuP.toString().toLowerCase().trim() : UsuP;
        usuP.contrasenia = PwdP;
        usuP.nombre = NombreP;
        usuP.tipo = TipoP;
        usuP.nivel = NivelP;
        
        this.usuarios.push(usuP);
    }
    guardarUsuarioAdministrador(UsuA, PwdA, NombreA, TipoA) {

        let usuA;

        usuA = new Administrador();

        usuA.usuario = UsuA != null ? UsuA.toString().toLowerCase().trim() : UsuA;
        usuA.contrasenia = PwdA;
        usuA.nombre = NombreA;
        usuA.tipo = TipoA;

        this.usuarios.push(usuA);
    }

    // versión genérica para guardar usuarios (delegando a los específicos)
    guardarUsuario(pUsu, pPwd, pNombre, pTipo, pNivel = "junior") {
        if (pTipo === "postulante") {
            this.guardarUsuarioPostulante(pUsu, pPwd, pNombre, pTipo, pNivel);
        } else if (pTipo === "administrador") {
            this.guardarUsuarioAdministrador(pUsu, pPwd, pNombre, pTipo);
        } else {
            // por defecto guardamos como postulante
            this.guardarUsuarioPostulante(pUsu, pPwd, pNombre, pTipo, pNivel);
        }
    }

    obtenerUsuario(pUsu) {
        let usuBuscado = null;
        if (!this.tengoAlgo(pUsu)) return null;
        let buscadoNorm = pUsu.toString().toLowerCase().trim();
        let i = 0;
        while (i < this.usuarios.length && usuBuscado == null) {
            let elUsuX = this.usuarios[i];
            if (elUsuX && elUsuX.usuario === buscadoNorm) {
                usuBuscado = elUsuX;
            }
            i++;
        }

        return usuBuscado;
    }

    validarUsuario(pUsu, pPwd, pNombre, pTipo) {
        let valido = false;
        if (this.tengoAlgo(pUsu) && this.tengoAlgo(pPwd) && this.tengoAlgo(pNombre) && this.tengoAlgo(pTipo)) {
            let usuNorm = pUsu.toString().toLowerCase().trim();
            if (this.validarContrasenia(pPwd) && this.validarUsuUnico(usuNorm)) {
                valido = true;
            }
        }
        return valido;
    }

    guardarOferta(idOF, NombreOF, DescripcionOF, EmpresaOF, NivelOF, VacantesOF, PostulantesOF, EstadoOF, DestacadaOF) {

        let oferta;
        oferta = new OfertaLaboral();

        oferta.id = idOF;
        oferta.nombre = NombreOF;
        oferta.descripcion = DescripcionOF;
        oferta.empresa = EmpresaOF;
        oferta.nivel = NivelOF;
        oferta.vacantes = VacantesOF;
        oferta.postulantes = PostulantesOF;
        oferta.estado = EstadoOF;
        oferta.destacada = DestacadaOF;

        this.ofertasLaborales.push(oferta);
    }

    guardarPostulacion(IdPostulacionPO, UsuarioPostulantePO, IdTrabajoPO, EstadoPO) {
        let postulacion;
        postulacion = new Postulacion();

        postulacion.id = IdPostulacionPO;
        postulacion.idTrabajo = IdTrabajoPO;
        postulacion.usuarioPostulante = UsuarioPostulantePO != null ? UsuarioPostulantePO.toString().toLowerCase().trim() : UsuarioPostulantePO;
        postulacion.estado = EstadoPO;

        this.postulaciones.push(postulacion);
    }

    postularseAOferta(idOferta) {
        if (!this.usuLogueado || this.usuLogueado.tipo !== "postulante") {
            return false;
        }
        if (!this.tengoAlgo(idOferta)) {
            return false;
        }
        let oferta = this.ofertasLaborales.find(o => o.id === idOferta);
        if (!oferta || oferta.estado !== "activo") {
            return false;
        }
        let yaPostulado = this.postulaciones.some(p => p.idTrabajo === idOferta && p.usuarioPostulante === this.usuLogueado.usuario);
        if (yaPostulado) {
            return false;
        }
        let idPostulacion = "JOB_POST_" + (this.postulaciones.length + 1);
        this.guardarPostulacion(idPostulacion, this.usuLogueado.usuario, idOferta, "pendiente");
        oferta.postulantes = Number(oferta.postulantes) + 1;
        if (Number(oferta.postulantes) === Number(oferta.vacantes)) {
            oferta.estado = "inactivo";
        }
        return true;
    }

    cargarOfertasActivas(filtro = "") {
        filtro = filtro != null ? filtro.toString().trim().toLowerCase() : "";
        let html = `
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Empresa</th>
                        <th>Vacantes</th>
                        <th>Postulantes</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>`;

        for (let i = 0; i < this.ofertasLaborales.length; i++) {
            let oferta = this.ofertasLaborales[i];
            let nombreMatch = filtro === "" || oferta.nombre.toLowerCase().includes(filtro);
            if (oferta.estado === "activo" && nombreMatch) {
                html += `
                    <tr>
                        <td>${oferta.nombre}</td>
                        <td>${oferta.descripcion}</td>
                        <td>${oferta.empresa}</td>
                        <td>${oferta.nivel}</td>
                        <td>${oferta.vacantes}</td>
                        <td>${oferta.postulantes}</td>
                        <td>${oferta.estado}</td>
                        <td><button onclick="postularseAOfertaUI('${oferta.id}')">Postularse</button></td>
                    </tr>`;
            }
        }

        html += `
                </tbody>
            </table>`;

        return html;
    }

    login(UsuP, PwdP, UsuA, PwdA) {
        let seLogueoOk = false;
        if (!this.tengoAlgo(UsuP) && !this.tengoAlgo(UsuA)) return false;
        let usuPnorm = this.tengoAlgo(UsuP) ? UsuP.toString().toLowerCase().trim() : null;
        let usuAnorm = this.tengoAlgo(UsuA) ? UsuA.toString().toLowerCase().trim() : null;
        let i = 0;
        while (!seLogueoOk && i < this.usuarios.length) {
            let usuX = this.usuarios[i];
            if (usuX) {
                if (usuPnorm && usuX.usuario === usuPnorm && usuX.contrasenia === PwdP) {
                    this.usuLogueado = usuX;
                    seLogueoOk = true;
                }
                if (!seLogueoOk && usuAnorm && usuX.usuario === usuAnorm && usuX.contrasenia === PwdA) {
                    this.usuLogueado = usuX;
                    seLogueoOk = true;
                }
            }
            i++;
        }
        return seLogueoOk;
    }
    cerrarSesion() {
        this.usuLogueado = null;
    }

    // utilidades
    tengoAlgo(pCosa) {
        return pCosa != null && pCosa.toString().trim().length > 0;
    }

    validarContrasenia(pPwd) {
        // placeholder: aplicar reglas reales si se requieren
        return pPwd != null && pPwd.toString().length >= 3;
    }

    validarUsuUnico(pUsu) {
        if (!this.tengoAlgo(pUsu)) return false;
        let usuNorm = pUsu.toString().toLowerCase().trim();
        for (let i = 0; i < this.usuarios.length; i++) {
            let u = this.usuarios[i];
            if (u && u.usuario === usuNorm) return false;
        }
        return true;
    }

    // Verifica si el nivel del postulante puede ver la oferta según su nivel
    cumplNivelRequerido(nivelPostulante, nivelOferta) {
        if (!this.tengoAlgo(nivelPostulante) || !this.tengoAlgo(nivelOferta)) {
            return false;
        }

        let nivelNorm = nivelPostulante;
        let ofertaNorm = nivelOferta;

        if (nivelNorm === "senior") {
            return ["junior", "semisenior", "senior"].includes(ofertaNorm);
        }

        return nivelNorm === ofertaNorm;
    }

    registrarUsuario(usuario, contrasenia, nombre, tipo, nivel = "junior") {
        this.guardarUsuario(usuario, contrasenia, nombre, tipo, nivel);
        return true;
    }

    // Obtiene todas las postulaciones del usuario logueado
    obtenerMisPostulaciones() {
        if (!this.usuLogueado || this.usuLogueado.tipo !== "postulante") {
            return [];
        }
        return this.postulaciones.filter(p => p.usuarioPostulante === this.usuLogueado.usuario);
    }

    // Obtiene las ofertas a las que se postuló el usuario logueado
    obtenerMisOfertasPostuladas() {
        let misPostulaciones = this.obtenerMisPostulaciones();
        let idsOfertasPostuladas = misPostulaciones.map(p => p.idTrabajo);
        return this.ofertasLaborales.filter(o => idsOfertasPostuladas.includes(o.id));
    }
}