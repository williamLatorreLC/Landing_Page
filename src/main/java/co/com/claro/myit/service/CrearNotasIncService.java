/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.CrearNotasIncRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;

/**
 *
 * @author dussan.palma
 */
public class CrearNotasIncService {

    private final CrearNotasIncRequest data;

    private functions fn;

    public CrearNotasIncService(CrearNotasIncRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String crearNotasInc() {
        String body = "";

        body = Const.xmlRequestCrearNotasInc;
        body = body.replaceAll("--inc--", this.data.getIncident_Number());
        body = body.replaceAll("--submitter--", this.data.getWork_Log_Submitter());
        body = body.replaceAll("--logtype--", "General Information");
        body = body.replaceAll("--detailed--", this.data.getDetailed_Description());
        body = body.replaceAll("--Attachment1Name--", this.data.getWorkInfoAttachment1Name());
        body = body.replaceAll("--Attachment1Data--", this.data.getWorkInfoAttachment1Data());
        return this.fn.SoapRequestCrearNotasInc(body, false);

    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetResponse");
        System.out.println(res);
        return res;
    }

}
