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
public class CaseSolvedModel {


    @SerializedName("ID")
    private int ID;

    @SerializedName("USUARIOANALISTA")
    private String USUARIOANALISTA;

    @SerializedName("NOMBREANALISTA")
    private String NOMBREANALISTA;

    @SerializedName("ESTADO")
    private String ESTADO;

    @SerializedName("NOTA")
    private String NOTA;

    @SerializedName("CODIGODECIERRE")
    private String CODIGODECIERRE;

    @SerializedName("NROMYIT")
    private String NROMYIT;


    @SerializedName("USUARIO")
    private String USUARIO;

    @SerializedName("NOMBREUSUARIO")
    private String NOMBREUSUARIO;

    @SerializedName("DOCUMENTOS")
    private List<DocumentModel> DOCUMENTOS;

    @SerializedName(value = "resolucion", alternate = {"RESOLUCION"})
    private String RESOLUCION;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
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

    public String getESTADO() {
        return ESTADO;
    }

    public void setESTADO(String ESTADO) {
        this.ESTADO = ESTADO;
    }


    public String getNOTA() {
        return NOTA;
    }

    public void setNOTA(String NOTA) {
        this.NOTA = NOTA;
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

    public List<DocumentModel> getDOCUMENTOS() {
        return DOCUMENTOS;
    }

    public void setDOCUMENTOS(List<DocumentModel> DOCUMENTOS) {
        this.DOCUMENTOS = DOCUMENTOS;
    }

    public String getUSUARIO() {
        return USUARIO;
    }

    public void setUSUARIO(String USUARIO) {
        this.USUARIO = USUARIO;
    }

    public String getNOMBREUSUARIO() {
        return NOMBREUSUARIO;
    }

    public void setNOMBREUSUARIO(String NOMBREUSUARIO) {
        this.NOMBREUSUARIO = NOMBREUSUARIO;
    }


}
