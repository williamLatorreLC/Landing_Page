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
public class ConsultModel {
    
    @Nullable
    @SerializedName("usuario")
    private String usuario;
    
    @Nullable
    @SerializedName("criterio")
    private String criterio;

    @Nullable
    @SerializedName("grupos")
    private List<String> grupos;

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public List<String> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<String> grupos) {
        this.grupos = grupos;
    }

    public String getCriterio() {
        return criterio;
    }

    public void setCriterio(String criterio) {
        this.criterio = criterio;
    }
    
}
