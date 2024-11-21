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

        try {
            // Validamos si "Envelope" y "Body" existen antes de proceder
            if (!respuesta.has("Envelope") || !respuesta.getAsJsonObject("Envelope").has("Body")) {
                res.addProperty("message", "Estructura de respuesta no válida: faltan 'Envelope' o 'Body'.");
                return res;
            }

            JsonObject envelope = respuesta.getAsJsonObject("Envelope");
            JsonObject body = envelope.getAsJsonObject("Body");

            // Validamos si hay un error en el Body
            if (body.has("Fault")) {
                res.addProperty("message", "¡Ups! Parece que este caso no existe. Te sugiero revisar esta información.");
                return res;
            }

            JsonObject getResponse = body.getAsJsonObject("GetResponse");

            // Extraemos propiedades si están presentes
            if (getResponse.has("Request_Number")) {
                res.addProperty("Request_Number", getResponse.get("Request_Number").getAsString());
            }
            if (getResponse.has("AppRequestID")) {
                res.addProperty("AppRequestID", getResponse.get("AppRequestID").getAsString());
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
            if (getResponse.has("Completion_Date")) {
                res.addProperty("Completion_Date", getResponse.get("Completion_Date").getAsString());
            }
            if (getResponse.has("Closed_Date")) {
                res.addProperty("Closed_Date", getResponse.get("Closed_Date").getAsString());
            }
            if (getResponse.has("Requestor_ID")) {
                res.addProperty("Requestor_ID", getResponse.get("Requestor_ID").getAsString());
            }
            if (getResponse.has("Requestor_By_ID")) {
                res.addProperty("Requestor_By_ID", getResponse.get("Requestor_By_ID").getAsString());
            }
        } catch (Exception e) {
            // Capturamos errores inesperados y retornamos un mensaje genérico
            res.addProperty("message", "Se produjo un error al procesar la respuesta: " + e.getMessage());
        }

        // Registro de la respuesta generada para fines de depuración
        System.out.println("Respuesta ConsultaCasosService.java linea 55");
        System.out.println(res);

        return res;
    }

}
