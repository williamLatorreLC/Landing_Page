/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.CTMPeopleWsGetRequest;
import co.com.claro.myit.api.Const;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 *
 * @author Dussan
 */
public class CTMPeopleWsGetService {

    private final CTMPeopleWsGetRequest data;

    private functions fn;

    public CTMPeopleWsGetService(CTMPeopleWsGetRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarCTMPeopleWsGet() {
        String body = "";

        body = Const.xmlRequestCTMPeopleGet;
        body = body.replaceAll("--user--", this.data.getRemedyLoginID());
        return this.fn.SoapRequestCTMPeopleGet(body, false);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        if (respuesta.has("Envelope")
                && respuesta.getAsJsonObject("Envelope").has("Body")
                && respuesta.getAsJsonObject("Envelope").getAsJsonObject("Body").has("GetResponse")) {

            JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                    .getAsJsonObject("Body")
                    .getAsJsonObject("GetResponse");

            res.addProperty("Id_Area_CA", getElementAsString(getResponse, "Id_Area_CA"));
            res.addProperty("Id_Gerencia_CA", getElementAsString(getResponse, "Id_Gerencia_CA"));
            res.addProperty("Id_Comite_CA", getElementAsString(getResponse, "Id_Comite_CA"));
            res.addProperty("Contact_Type", getElementAsString(getResponse, "Contact_Type"));

        } else {
            res.addProperty("message", "¡Ups! La estructura del getBody CTMPeopleWsGetService no es válida.");
        }

        System.out.println("Respuesta CTMPeopleWsGetService.java");
        System.out.println(res);

        return res;
    }

    private String getElementAsString(JsonObject jsonObject, String key) {
        if (jsonObject.has(key)) {
            JsonElement element = jsonObject.get(key);
            if (element.isJsonNull()) {
                return "";
            }
            if (element.isJsonPrimitive()) {
                return element.getAsString();
            }
            if (element.isJsonObject()) {
                JsonObject obj = element.getAsJsonObject();
                if (obj.has("@xsi:nil") && "true".equals(obj.get("@xsi:nil").getAsString())) {
                    return "";
                }
                if (obj.has("#text")) {
                    return obj.get("#text").getAsString();
                }
                return "";
            }
        }
        return "";
    }

}
