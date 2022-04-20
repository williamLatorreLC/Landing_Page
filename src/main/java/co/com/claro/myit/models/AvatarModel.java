/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.models;

import com.google.gson.annotations.SerializedName;
import com.sun.istack.Nullable;

/**
 *
 * @author kompl
 */
public class AvatarModel {

    @Nullable
    @SerializedName("id")
    private int id;

    @SerializedName("imagen")
    private String imagen;

    @Nullable
    @SerializedName("estado")
    private int estado;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

}
