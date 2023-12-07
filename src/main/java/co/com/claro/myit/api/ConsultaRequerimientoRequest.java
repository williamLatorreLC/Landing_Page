/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import com.google.gson.annotations.SerializedName;

/**
 *
 * @author dussan.palma
 */
public class ConsultaRequerimientoRequest {
   
    @SerializedName("reqNumber")
    private String reqNumber;

    public String getReqNumber() {
        return reqNumber;
    }

    public void setReqNumber(String reqNumber) {
        this.reqNumber = reqNumber;
    }
    
    
}
