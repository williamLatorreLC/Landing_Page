/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.models;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author JD
 */
@Getter
@Setter
public class CaseDataModel {

    @SerializedName("aplicacion")
    private String aplicacion;

    @SerializedName("correo")
    private String correo;

    @SerializedName("date")
    private String date;

    @SerializedName("descripcion")
    private String descripcion;

    @SerializedName("fecha")
    private String fecha;

    @SerializedName("hora")
    private String hora;

    @SerializedName("impactoVacio")
    private String impacto;

    @SerializedName("lineaServicio")
    private String lineaServicio;

    @SerializedName("nombre")
    private String nombre;

    @SerializedName("requisitos")
    private String requisitos;

    @SerializedName("sede")
    private String sede;

    @SerializedName("telefono")
    private String telefono;

    @SerializedName("tipoCliente")
    private String tipoCliente;

    @SerializedName("tipoFalla")
    private String tipoFalla;

    @SerializedName("tipoOperacion")
    private String tipoOperacion;

    @SerializedName("usuario")
    private String usuario;

    @SerializedName("servicio")
    private String servicio;

    @SerializedName("documentos")
    private List<DocumentModel> documentos;

    @SerializedName("urgencia")
    private String urgenciaId;
    @SerializedName("impacto")
    private String impactoId;

    public String getAplicacion() {
        return aplicacion;
    }

    public void setAplicacion(String aplicacion) {
        this.aplicacion = aplicacion;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getImpacto() {
        return impacto;
    }

    public void setImpacto(String impacto) {
        this.impacto = impacto;
    }

    public String getLineaServicio() {
        return lineaServicio;
    }

    public void setLineaServicio(String lineaServicio) {
        this.lineaServicio = lineaServicio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }

    public String getSede() {
        return sede;
    }

    public void setSede(String sede) {
        this.sede = sede;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getTipoCliente() {
        return tipoCliente;
    }

    public void setTipoCliente(String tipoCliente) {
        this.tipoCliente = tipoCliente;
    }

    public String getTipoFalla() {
        return tipoFalla;
    }

    public void setTipoFalla(String tipoFalla) {
        this.tipoFalla = tipoFalla;
    }

    public String getTipoOperacion() {
        return tipoOperacion;
    }

    public void setTipoOperacion(String tipoOperacion) {
        this.tipoOperacion = tipoOperacion;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public List getDocumentos() {
        return documentos;
    }

    public void setDocumentos(List<DocumentModel> documentos) {
        this.documentos = documentos;
    }

}
