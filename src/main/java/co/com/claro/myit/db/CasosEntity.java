/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import co.com.claro.myit.models.CaseDataModel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author JD
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "CASOS")
@XmlRootElement
public class CasosEntity implements Serializable {

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

    @Column(name = "ID_IMPACTO")
    private String impactoId;
    @Column(name = "ID_URGENCIA")
    private String urgenciaId;
    @Column(name = "USUARIO_VIP")
    private Integer usuarioVIP;
    @Column(name = "BIA")
    private String bia;
    @Column(name = "ID_PRIORIDAD_INCIDENTES")
    private String prioridadIncidenteId;
    @Column(name = "ID_PRIORIDAD_SOLICITUDES")
    private String prioridadSolicitudId;
    @Column(name = "RESOLUCION")
    private String RESOLUCION;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getCONSECUTIVO() {
        return CONSECUTIVO;
    }

    public void setCONSECUTIVO(String CONSECUTIVO) {
        this.CONSECUTIVO = CONSECUTIVO;
    }

    public String getNOMBRE() {
        return NOMBRE;
    }

    public void setNOMBRE(String NOMBRE) {
        this.NOMBRE = NOMBRE;
    }

    public String getUSUARIO() {
        return USUARIO;
    }

    public void setUSUARIO(String USUARIO) {
        this.USUARIO = USUARIO;
    }

    public String getTELEFONO() {
        return TELEFONO;
    }

    public void setTELEFONO(String TELEFONO) {
        this.TELEFONO = TELEFONO;
    }

    public String getCORREO() {
        return CORREO;
    }

    public void setCORREO(String CORREO) {
        this.CORREO = CORREO;
    }

    public String getUSUARIOANALISTA() {
        return USUARIOANALISTA;
    }

    public void setUSUARIOANALISTA(String USUARIOANALISTA) {
        this.USUARIOANALISTA = USUARIOANALISTA;
    }

    public String getNOMBREANALISTA() {
        return NOMBREANALISTA;
    }

    public void setNOMBREANALISTA(String NOMBREANALISTA) {
        this.NOMBREANALISTA = NOMBREANALISTA;
    }

    public String getSEDE() {
        return SEDE;
    }

    public void setSEDE(String SEDE) {
        this.SEDE = SEDE;
    }

    public String getTIPOOPERACION() {
        return TIPOOPERACION;
    }

    public void setTIPOOPERACION(String TIPOOPERACION) {
        this.TIPOOPERACION = TIPOOPERACION;
    }

    public String getLINEASERVICIO() {
        return LINEASERVICIO;
    }

    public void setLINEASERVICIO(String LINEASERVICIO) {
        this.LINEASERVICIO = LINEASERVICIO;
    }

    public String getSERVICIO() {
        return SERVICIO;
    }

    public void setSERVICIO(String SERVICIO) {
        this.SERVICIO = SERVICIO;
    }

    public String getAPLICACION() {
        return APLICACION;
    }

    public void setAPLICACION(String APLICACION) {
        this.APLICACION = APLICACION;
    }

    public String getTIPODEFALLA() {
        return TIPODEFALLA;
    }

    public void setTIPODEFALLA(String TIPODEFALLA) {
        this.TIPODEFALLA = TIPODEFALLA;
    }

    public String getDESCRIPCIONDETALLADA() {
        return DESCRIPCIONDETALLADA;
    }

    public void setDESCRIPCIONDETALLADA(String DESCRIPCIONDETALLADA) {
        this.DESCRIPCIONDETALLADA = DESCRIPCIONDETALLADA;
    }

    public String getESTADO() {
        return ESTADO;
    }

    public void setESTADO(String ESTADO) {
        this.ESTADO = ESTADO;
    }

    public String getGRUPOASIGNADO() {
        return GRUPOASIGNADO;
    }

    public void setGRUPOASIGNADO(String GRUPOASIGNADO) {
        this.GRUPOASIGNADO = GRUPOASIGNADO;
    }

    public String getUSUARIOASIGNADO() {
        return USUARIOASIGNADO;
    }

    public void setUSUARIOASIGNADO(String USUARIOASIGNADO) {
        this.USUARIOASIGNADO = USUARIOASIGNADO;
    }

    public String getNOTADETRABAJO() {
        return NOTADETRABAJO;
    }

    public void setNOTADETRABAJO(String NOTADETRABAJO) {
        this.NOTADETRABAJO = NOTADETRABAJO;
    }

    public String getCODIGODECIERRE() {
        return CODIGODECIERRE;
    }

    public void setCODIGODECIERRE(String CODIGODECIERRE) {
        this.CODIGODECIERRE = CODIGODECIERRE;
    }

    public String getNROMYIT() {
        return NROMYIT;
    }

    public void setNROMYIT(String NROMYIT) {
        this.NROMYIT = NROMYIT;
    }


    public String getFECHAREGISTRO() {
        return FECHAREGISTRO;
    }

    public void setFECHAREGISTRO(String FECHAREGISTRO) {
        this.FECHAREGISTRO = FECHAREGISTRO;
    }

    public Timestamp getFECHACREACION() {
        return FECHACREACION;
    }

    public void setFECHACREACION(Timestamp FECHACREACION) {
        this.FECHACREACION = FECHACREACION;
    }

    public String getTIPOCLIENTE() {
        return TIPOCLIENTE;
    }

    public void setTIPOCLIENTE(String TIPOCLIENTE) {
        this.TIPOCLIENTE = TIPOCLIENTE;
    }

    public CasosEntity FromModel(CaseDataModel data, int id) {
        CasosEntity entity = new CasosEntity();
        entity.setAPLICACION(data.getAplicacion());
        entity.setDESCRIPCIONDETALLADA(data.getDescripcion());
        entity.setESTADO("1000");
        entity.setLINEASERVICIO(data.getLineaServicio());
        entity.setNOMBRE(data.getNombre());
        entity.setSEDE(data.getSede());
        entity.setSERVICIO(data.getServicio());
        entity.setTELEFONO(data.getTelefono());
        entity.setTIPOCLIENTE(data.getTipoCliente());
        entity.setTIPODEFALLA(data.getTipoFalla());
        entity.setTIPOOPERACION(data.getTipoOperacion());
        entity.setID(id);
        entity.setCONSECUTIVO("LANREQ00000000" + id);
        entity.setCORREO(data.getCorreo());
        entity.setUSUARIO(data.getUsuario());
        entity.setFECHAREGISTRO(data.getFecha() + " " + data.getHora());
        entity.setFECHACREACION(new Timestamp(System.currentTimeMillis()));
        return entity;
    }
}
