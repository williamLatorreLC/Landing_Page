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
 * @author kompl
 */
public class BannerModel {

    @Nullable
    @SerializedName("id")
    private int id;

    @SerializedName("ruta")
    private String ruta;

    @Nullable
    @SerializedName("estado")
    private int estado;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

}
