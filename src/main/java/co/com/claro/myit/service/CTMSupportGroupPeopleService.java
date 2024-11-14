/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.CTMSupportGroupPeopleRequest;
import co.com.claro.myit.api.Const;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;

/**
 *
 * @author Dussan
 */
public class CTMSupportGroupPeopleService {
    
    private final CTMSupportGroupPeopleRequest data;

    private functions fn;

    public CTMSupportGroupPeopleService(CTMSupportGroupPeopleRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarCTMSupportGroupPeople() {
        String body = "";

        body = Const.xmlRequestCTMSupportGroupPeopleGetList;
        body = body.replaceAll("--user--", this.data.getRemedyLoginID());
        return this.fn.SoapRequestCTMSupportGroupPeople(body, false);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetResponse");

        res.addProperty("Support_Group_ID", getResponse.has("Support_Group_ID") ? getResponse.get("Support_Group_ID").getAsString() : "");
        
        System.out.println("Respuesta CTMSupportGroupPeopleService.java");
        System.out.println(res);
        return res;
    }
    
}
