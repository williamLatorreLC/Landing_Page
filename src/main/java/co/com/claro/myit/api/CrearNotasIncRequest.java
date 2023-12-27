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
public class CrearNotasIncRequest {

    @SerializedName("Incident_Number")
    private String Incident_Number;

    @SerializedName("Work_Log_Submitter")
    private String Work_Log_Submitter;

    @SerializedName("Detailed_Description")
    private String Detailed_Description;

    @SerializedName("Work_Log_Type")
    private String Work_Log_Type;

    public String getIncident_Number() {
        return Incident_Number;
    }

    public void setIncident_Number(String Incident_Number) {
        this.Incident_Number = Incident_Number;
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
