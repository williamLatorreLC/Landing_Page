/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaIncidenteRequest;
import co.com.claro.myit.api.ConsultaOrdenTrabajoRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;

/**
 *
 * @author dussan.palma
 */
public class ConsultaIncidenteService {

    private final ConsultaIncidenteRequest data;

    private functions fn;

    public ConsultaIncidenteService(ConsultaIncidenteRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public ConsultaIncidenteService(ConsultaOrdenTrabajoRequest datos, functions fn) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public String consultarINC() {
        String body = "";

        body = Const.xmlRequestConsultaINC;
        body = body.replaceAll("--inc--", this.data.getIncNumber());
        return this.fn.SoapRequestConsutaINC(body, false);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetResponse");

        res.addProperty("Incident_Number", getResponse.get("Incident_Number").getAsString());
        res.addProperty("Status", getResponse.get("Status").getAsString());
        res.addProperty("Description", getResponse.get("Description").getAsString());
        res.addProperty("Submit_Date", getResponse.get("Submit_Date").getAsString());
        res.addProperty("Detailed_Description", getResponse.get("Detailed_Description").getAsString());

        System.out.println("Respuesta ConsultaOrdenTrabajoSerice.java");
        System.out.println(res);
        return res;
    }

}
