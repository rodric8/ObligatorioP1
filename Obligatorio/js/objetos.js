

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
    static idContadorOF = 0;
    constructor() {
        this.id = OfertaLaboral.idContadorOF++;
        this.nombre = "";
        this.descripcion = "";
        this.estado = "";
        this.sueldo = 0;
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
