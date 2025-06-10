/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.models;

import com.google.gson.annotations.SerializedName;
import jakarta.annotation.Nullable;
import java.util.List;

/**
 *
 * @author JD
 */
public class CaseGestionModel {

    @Nullable
    @SerializedName("idCaso")
    private int idCaso;

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
    @SerializedName("documentos")
    private List<DocumentModel> documentos;

    public int getIdCaso() {
        return idCaso;
    }

    public void setIdCaso(int idCaso) {
        this.idCaso = idCaso;
    }

    public List<DocumentModel> getDocumentos() {
        return documentos;
    }

    public void setDocumentos(List<DocumentModel> documentos) {
        this.documentos = documentos;
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
    
    

}
