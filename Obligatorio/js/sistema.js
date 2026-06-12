class Sistema {
    constructor() {
        this.usuarios = new Array();
        this.usuLogueado = null;
        this.ofertasLaborales = new Array();
        this.postulaciones = new Array();
    }


    guardarUsuarioPostulante(UsuP, PwdP, NombreP, TipoP) {

        let usuP;

        usuP = new Postulante();

        usuP.usuario = UsuP;
        usuP.contrasenia = PwdP;
        usuP.nombre = NombreP;
        usuP.tipo = TipoP;

        this.usuarios.push(usuP);
    }
    guardarUsuarioAdministrador(UsuA, PwdA, NombreA, TipoA) {

        let usuA;

        usuA = new Administrador();

        usuA.usuario = UsuA;
        usuA.contrasenia = PwdA;
        usuA.nombre = NombreA;
        usuA.tipo = TipoA;

        this.usuarios.push(usuA);
    }

    // versión genérica para guardar usuarios (delegando a los específicos)
    guardarUsuario(pUsu, pPwd, pNombre, pTipo) {
        if (pTipo === "postulante") {
            this.guardarUsuarioPostulante(pUsu, pPwd, pNombre, pTipo);
        } else if (pTipo === "administrador") {
            this.guardarUsuarioAdministrador(pUsu, pPwd, pNombre, pTipo);
        } else {
            // por defecto guardamos como postulante
            this.guardarUsuarioPostulante(pUsu, pPwd, pNombre, pTipo);
        }
    }

    obtenerUsuario(pUsu) {
        let usuBuscado = null;
        let i = 0;
        while (i < this.usuarios.length && usuBuscado == null) {
            let elUsuX = this.usuarios[i];
            if (elUsuX.usuario === pUsu) {
                usuBuscado = elUsuX;
            }
            i++;
        }
        return usuBuscado;
    }

    validarUsuario(pUsu, pPwd, pNombre, pTipo) {
        let valido = false;
        if (this.tengoAlgo(pUsu) && this.tengoAlgo(pPwd) && this.tengoAlgo(pNombre) && this.tengoAlgo(pTipo)) {
            if (this.validarContrasenia(pPwd) && this.validarUsuUnico(pUsu)) {
                valido = true;
            }
        }
        return valido;
    }

    guardarOferta(NombreOF, DescripcionOF, EmpresaOF, VacantesOF,PostulantesOF, EstadoOF, DestacadaOF) {

        let oferta;
        oferta = new OfertaLaboral();

        oferta.nombre = NombreOF;
        oferta.descripcion = DescripcionOF;
        oferta.empresa = EmpresaOF;
        oferta.vacantes = VacantesOF;
        oferta.postulantes = PostulantesOF;
        oferta.estado = EstadoOF;
        oferta.destacada = DestacadaOF;

        this.ofertasLaborales.push(oferta);
    }

    guardarPostulacion(IdTrabajoPO, UsuarioPostulantePO, EstadoPO) {
        let postulacion;
        postulacion = new Postulacion();

        postulacion.idTrabajo = IdTrabajoPO;
        postulacion.usuarioPostulante = UsuarioPostulantePO;
        postulacion.estado = EstadoPO;

        this.postulaciones.push(postulacion);
    }

    login(UsuP, PwdP, UsuA, PwdA) {
        let seLogueoOk = false;
        let i = 0;
        while (!seLogueoOk && i < this.usuarios.length) {
            let usuX = this.usuarios[i];
            if (usuX.usuario === UsuP && usuX.contrasenia === PwdP) {
                this.usuLogueado = usuX;
                seLogueoOk = true;
                


            }
            if (usuX.usuario === UsuA && usuX.contrasenia === PwdA) {
                this.usuLogueado = usuX;
                seLogueoOk = true;
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
        for (let i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].usuario === pUsu) return false;
        }
        return true;
    }
}