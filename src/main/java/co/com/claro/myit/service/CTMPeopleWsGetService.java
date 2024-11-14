/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.CTMPeopleWsGetRequest;
import co.com.claro.myit.api.Const;
import co.com.claro.myit.util.functions;
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

        JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetResponse");

        res.addProperty("Id_Area_CA", getResponse.has("Id_Area_CA") ? getResponse.get("Id_Area_CA").getAsString() : "");
        res.addProperty("Id_Gerencia_CA", getResponse.has("Id_Gerencia_CA") ? getResponse.get("Id_Gerencia_CA").getAsString() : "");
        res.addProperty("Id_Comite_CA", getResponse.has("Id_Comite_CA") ? getResponse.get("Id_Comite_CA").getAsString() : "");
        res.addProperty("Contact_Type", getResponse.has("Contact_Type") ? getResponse.get("Contact_Type").getAsString() : "");

        System.out.println("Respuesta CTMPeopleWsGetService.java");
        System.out.println(res);
        return res;
    }

}
