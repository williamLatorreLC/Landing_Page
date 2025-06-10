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
public class ServiceModel {
    
    @Nullable
    @SerializedName("aplicacion")
    private String aplicacion;
    
    @Nullable
    @SerializedName("organizacion")
    private String organizacion;
    
    @Nullable
    @SerializedName("servicio")
    private String servicio;
    
    @Nullable
    @SerializedName("lineaServicio")
    private String lineaServicio;
    
    
    @Nullable
    @SerializedName("tipoFalla")
    private String tipoFalla;

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public String getAplicacion() {
        return aplicacion;
    }

    public void setAplicacion(String aplicacion) {
        this.aplicacion = aplicacion;
    }

    public String getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(String organizacion) {
        this.organizacion = organizacion;
    }

    public String getLineaServicio() {
        return lineaServicio;
    }

    public void setLineaServicio(String lineaServicio) {
        this.lineaServicio = lineaServicio;
    }

    public String getTipoFalla() {
        return tipoFalla;
    }

    public void setTipoFalla(String tipoFalla) {
        this.tipoFalla = tipoFalla;
    }
    
}
