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
 * @author JD
 */
public class DocumentModel {
    
    @Nullable
    @SerializedName("file")
    private String file;

    @Nullable
    @SerializedName("nombre")
    private String nombre;

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    
    
}
