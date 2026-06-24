

class Administrador {
    static idContadorA = 0;
    constructor() {
        this.id = Administrador.idContadorA++;
        this.usuario = "";
        this.contrasenia = "";
        this.nombre = "";
        this.tipo = "";
    }
}
class Postulante {
    static idContadorP = 0;
    constructor() {
        this.id = Postulante.idContadorP++;
        this.usuario = "";
        this.contrasenia = "";
        this.nombre = "";
        this.tipo = "";
        this.nivel = "";
    }
}

class OfertaLaboral {
    static idContadorOF = 1;

    constructor() {
        this.id = "JOB_OFFER_" + OfertaLaboral.idContadorOF++;
        this.nombre = "";
        this.descripcion = "";
        this.empresa = "";
        this.nivel = "";
        this.vacantes = 0;
        this.postulantes = 0;
        this.estado = "";
        this.destacada = "";
    }
}

class Postulacion {
    static idContadorPO = 0;
    constructor() {
        this.id = Postulacion.idContadorPO++;
        this.idTrabajo = 0;
        this.usuarioPostulante = "";
        this.estado = "";
    }
}
