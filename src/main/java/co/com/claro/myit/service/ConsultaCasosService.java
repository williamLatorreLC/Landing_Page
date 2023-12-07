/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaRequerimientoRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;


/**
 *
 * @author dussan.palma
 */
public class ConsultaCasosService {

    private final ConsultaRequerimientoRequest data;

    private functions fn;

    public ConsultaCasosService(ConsultaRequerimientoRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarReq() {
        String body = "";

        body = Const.xmlRequestConsultaReq;
        body = body.replaceAll("--req--", this.data.getReqNumber());
        return this.fn.SoapRequestConsutaReq(body, false);

    }

public JsonObject getBody(JsonObject respuesta) {
    JsonObject res = new JsonObject();

    JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                                      .getAsJsonObject("Body")
                                      .getAsJsonObject("GetResponse");

    res.addProperty("Request_Number", getResponse.get("Request_Number").getAsString());
    res.addProperty("AppRequestID", getResponse.get("AppRequestID").getAsString());
    res.addProperty("Status", getResponse.get("Status").getAsString());
    res.addProperty("Summary", getResponse.get("Summary").getAsString());
    res.addProperty("Submit_Date", getResponse.get("Submit_Date").getAsString());
    res.addProperty("Completion_Date", getResponse.get("Completion_Date").getAsString());
    res.addProperty("Closed_Date", getResponse.get("Closed_Date").getAsString());
    res.addProperty("Status_Reason", getResponse.get("Status_Reason").getAsString());
    res.addProperty("Requestor_ID", getResponse.get("Requestor_ID").getAsString());
    res.addProperty("Requestor_By_ID", getResponse.get("Requestor_By_ID").getAsString());

    System.out.println("Respuesta ConsultaCasosService.java linea 55");
    System.out.println(res);
    return res;
}
}
