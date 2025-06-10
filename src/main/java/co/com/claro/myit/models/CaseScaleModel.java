/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.models;

import com.google.gson.annotations.SerializedName;
import jakarta.annotation.Nullable;


/**
 *
 * @author JD
 */
public class CaseScaleModel {
    
    @Nullable
    @SerializedName("idGrupo")
    private String idGrupo;
    
    @Nullable
    @SerializedName("idCaso")
    private String idCaso;

    @Nullable
    @SerializedName("grupo")
    private String grupo;
    
    @Nullable
    @SerializedName("nota")
    private String nota;
    
    @Nullable
    @SerializedName("usuario")
    private String usuario;
    
    @Nullable
    @SerializedName("nombreUsuario")
    private String nombreUsuario;
    
    @Nullable
    @SerializedName("usuarioAsignado")
    private String usuarioAsignado;
    
    @Nullable
    @SerializedName("nombreUsuarioAsignado")
    private String nombreUsuarioAsignado;

    public String getIdCaso() {
        return idCaso;
    }

    public void setIdCaso(String idCaso) {
        this.idCaso = idCaso;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getIdGrupo() {
        return idGrupo;
    }

    public void setIdGrupo(String idGrupo) {
        this.idGrupo = idGrupo;
    }

    public String getUsuarioAsignado() {
        return usuarioAsignado;
    }

    public void setUsuarioAsignado(String usuarioAsignado) {
        this.usuarioAsignado = usuarioAsignado;
    }

    public String getNombreUsuarioAsignado() {
        return nombreUsuarioAsignado;
    }

    public void setNombreUsuarioAsignado(String nombreUsuarioAsignado) {
        this.nombreUsuarioAsignado = nombreUsuarioAsignado;
    }
    
}
