/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaIncidenteRequest;
import co.com.claro.myit.api.ConsultaOrdenTrabajoRequest;
import co.com.claro.myit.util.functions;
import jakarta.json.JsonObject;


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

        JsonObject envelope = respuesta.getAsJsonObject("Envelope");
        JsonObject body = envelope.getAsJsonObject("Body");

        if (body.has("Fault")) {
            // Hay un error, devolvemos el mensaje de error
            res.addProperty("message", "¡Ups! Parece que este caso no existe. Te sugiero revisar esta información.");
        } else {
            JsonObject getResponse = body.getAsJsonObject("GetResponse");

            if (getResponse.has("Incident_Number")) {
                res.addProperty("Incident_Number", getResponse.get("Incident_Number").getAsString());
            }

            if (getResponse.has("Status")) {
                res.addProperty("Status", getResponse.get("Status").getAsString());
            }

            if (getResponse.has("Description")) {
                res.addProperty("Description", getResponse.get("Description").getAsString());
            }

            if (getResponse.has("Submit_Date")) {
                res.addProperty("Submit_Date", getResponse.get("Submit_Date").getAsString());
            }

            if (getResponse.has("Detailed_Decription")) {
                res.addProperty("Detailed_Decription", getResponse.get("Detailed_Decription").getAsString());
            }

            if (getResponse.has("Resolution")) {
                res.addProperty("Resolution", getResponse.get("Resolution").getAsString());
            }

            if (getResponse.has("Real_Solution_Date")) {
                res.addProperty("Real_Solution_Date", getResponse.get("Real_Solution_Date").getAsString());
            }
        }

        System.out.println("Respuesta ConsultaOrdenTrabajoService.java");
        System.out.println(res);
        return res;
    }

}
