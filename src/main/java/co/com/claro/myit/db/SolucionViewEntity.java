package co.com.claro.myit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.io.Serializable;
import java.sql.Timestamp;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "LANADM", name = "V_SOLUCION")
public class SolucionViewEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID")
    private int ID;

    @Column(name = "NOMBRE")
    private String NOMBRE;

    @Column(name = "USUARIO")
    private String USUARIO;

    @Column(name = "TELEFONO")
    private String TELEFONO;

    @Column(name = "CORREO")
    private String CORREO;

    @Column(name = "USUARIOANALISTA")
    private String USUARIOANALISTA;

    @Column(name = "NOMBREANALISTA")
    private String NOMBREANALISTA;

    @Column(name = "SEDE")
    private String SEDE;

    @Column(name = "TIPOOPERACION")
    private String TIPOOPERACION;

    @Column(name = "LINEASERVICIO")
    private String LINEASERVICIO;

    @Column(name = "SERVICIO")
    private String SERVICIO;

    @Column(name = "APLICACION")
    private String APLICACION;

    @Column(name = "TIPODEFALLA")
    private String TIPODEFALLA;

    @Column(name = "DESCRIPCIONDETALLADA")
    private String DESCRIPCIONDETALLADA;

    @Column(name = "ESTADO")
    private String ESTADO;

    @Column(name = "GRUPOASIGNADO")
    private String GRUPOASIGNADO;

    @Column(name = "USUARIOASIGNADO")
    private String USUARIOASIGNADO;

    @Column(name = "NOTADETRABAJO")
    private String NOTADETRABAJO;

    @Column(name = "CODIGODECIERRE")
    private String CODIGODECIERRE;

    @Column(name = "NROMYIT")
    private String NROMYIT;

    @Column(name = "FECHAREGISTRO")
    private String FECHAREGISTRO;


    @Column(name = "CONSECUTIVO")
    private String CONSECUTIVO;


    @Column(name = "TIPOCLIENTE")
    private String TIPOCLIENTE;


    @Column(name = "FECHACREACION")
    private Timestamp FECHACREACION;


    @Column(name = "USUARIO_VIP")
    private Integer USUARIOVIP;
    @Column(name = "BIA")
    private String BIA;
    @Column(name = "ID_PRIORIDAD_INCIDENTES")
    private String PRIORIDADINICIDENTEID;
    @Column(name = "ID_PRIORIDAD_SOLICITUDES")
    private String PRIORIDADSOLICITUDID;
    @Column(name = "RESOLUCION")
    private String RESOLUCION;

    // Detalle Impacto
    @Column(name = "ID_IMPACTO")
    private String IMPACTOID;
    @Column(name = "IMPACTODESC")
    private String IMPACTODESC;

    // Detalle Urgencias
    @Id
    @Column(name = "ID_URGENCIA")
    private String URGENCIAID;
    @Column(name = "URGENCIADESC")
    private String URGENCIADESC;

    //Prioridades
    @Column(name = "PRIORIDAD_SOLICITUDES")
    private String PRIORIDADSOLICITUD;
    @Column(name = "PRIORIDAD_INCIDENTES")
    private String PRIORIDADINCIDENTE;

    //Otros
    @Column(name = "NOMBREUSUARIOASIGNADO")
    private String NOMBREUSUARIOASIGNADO;
    @Column(name = "CODIGOCIERREDESC")
    private String CODIGOCIERREDESC;
    @Column(name = "ESTADODESC")
    private String ESTADODESC;
}
