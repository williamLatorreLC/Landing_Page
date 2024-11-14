/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import com.google.gson.annotations.SerializedName;

/**
 *
 * @author Dussan
 */
public class CTMSupportGroupPeopleRequest {
    
    @SerializedName("remedyLoginID")
    private String remedyLoginID;

    public String getRemedyLoginID() {
        return remedyLoginID;
    }

    public void setRemedyLoginID(String remedyLoginID) {
        this.remedyLoginID = remedyLoginID;
    }
    
}
