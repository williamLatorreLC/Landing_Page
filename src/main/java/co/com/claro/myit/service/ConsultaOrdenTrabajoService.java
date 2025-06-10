/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaOrdenTrabajoRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 *
 * @author dussan.palma
 */
public class ConsultaOrdenTrabajoService {

    private final ConsultaOrdenTrabajoRequest data;

    private functions fn;

    public ConsultaOrdenTrabajoService(ConsultaOrdenTrabajoRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarWO() {
        String body = "";

        body = Const.xmlRequestConsultaWO;
        body = body.replaceAll("--wo--", this.data.getWoNumber());
        return this.fn.SoapRequestConsutaWO(body, false);
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

        if (getResponse.has("Work_Order_ID")) {
            res.addProperty("Work_Order_ID", getResponse.get("Work_Order_ID").getAsString());
        }

        if (getResponse.has("Status")) {
            res.addProperty("Status", getResponse.get("Status").getAsString());
        } 

        if (getResponse.has("Summary")) {
            res.addProperty("Summary", getResponse.get("Summary").getAsString());
        }

        if (getResponse.has("Submit_Date")) {
            res.addProperty("Submit_Date", getResponse.get("Submit_Date").getAsString());
        }

        if (getResponse.has("Detailed_Description")) {
            res.addProperty("Detailed_Description", getResponse.get("Detailed_Description").getAsString());
        }
    }

    System.out.println("Respuesta ConsultaOrdenTrabajoService.java");
    System.out.println(res);
    return res;
}

}
