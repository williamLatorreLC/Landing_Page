/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaOrdenTrabajoRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;

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

        JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetResponse");

        res.addProperty("Work_Order_ID", getResponse.get("Work_Order_ID").getAsString());
        res.addProperty("Status", getResponse.get("Status").getAsString());
        res.addProperty("Summary", getResponse.get("Summary").getAsString());
        res.addProperty("Submit_Date", getResponse.get("Submit_Date").getAsString());
        res.addProperty("Detailed_Description", getResponse.get("Detailed_Description").getAsString());

        System.out.println("Respuesta ConsultaOrdenTrabajoSerice.java");
        System.out.println(res);
        return res;
    }

}
