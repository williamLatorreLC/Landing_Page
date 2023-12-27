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
public class CrearNotasWoRequest {

    @SerializedName("Work_Order_ID")
    private String Work_Order_ID;

    @SerializedName("Work_Log_Submitter")
    private String Work_Log_Submitter;

    @SerializedName("Detailed_Description")
    private String Detailed_Description;

    @SerializedName("Work_Log_Type")
    private String Work_Log_Type;

    public String getWork_Order_ID() {
        return Work_Order_ID;
    }

    public void setWork_Order_ID(String Work_Order_ID) {
        this.Work_Order_ID = Work_Order_ID;
    }

    public String getWork_Log_Submitter() {
        return Work_Log_Submitter;
    }

    public void setWork_Log_Submitter(String Work_Log_Submitter) {
        this.Work_Log_Submitter = Work_Log_Submitter;
    }

    public String getDetailed_Description() {
        return Detailed_Description;
    }

    public void setDetailed_Description(String Detailed_Description) {
        this.Detailed_Description = Detailed_Description;
    }

    public String getWork_Log_Type() {
        return Work_Log_Type;
    }

    public void setWork_Log_Type(String Work_Log_Type) {
        this.Work_Log_Type = Work_Log_Type;
    }
    
    

}
