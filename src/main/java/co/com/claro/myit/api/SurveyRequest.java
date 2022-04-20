/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import com.google.gson.annotations.SerializedName;

/**
 *
 * @author kompl
 */
public class SurveyRequest { 
    
    
    @SerializedName("id")
    private String id;

    @SerializedName("comentario")
    private String comentario;

    
    @SerializedName("token")
    private String token;
    
    @SerializedName("calificacion")
    private String calificacion;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(String calificacion) {
        this.calificacion = calificacion;
    }
        
}
