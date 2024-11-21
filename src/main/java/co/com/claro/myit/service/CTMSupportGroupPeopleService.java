/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.CTMSupportGroupPeopleRequest;
import co.com.claro.myit.api.Const;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
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

        try {
            if (respuesta.has("Envelope")
                    && respuesta.getAsJsonObject("Envelope").has("Body")
                    && respuesta.getAsJsonObject("Envelope").getAsJsonObject("Body").has("GetListResponse")) {

                JsonObject getListResponse = respuesta.getAsJsonObject("Envelope")
                        .getAsJsonObject("Body")
                        .getAsJsonObject("GetListResponse");

                if (getListResponse.has("getListValues") && getListResponse.get("getListValues").isJsonArray()) {
                    JsonArray supportGroups = new JsonArray();
                    JsonArray listValues = getListResponse.getAsJsonArray("getListValues");
                    for (JsonElement element : listValues) {
                        JsonObject group = element.getAsJsonObject();
                        JsonObject supportGroup = new JsonObject();

                        supportGroup.addProperty("Remedy_Login_ID", group.has("Remedy_Login_ID")
                                ? group.get("Remedy_Login_ID").getAsString()
                                : "");
                        supportGroup.addProperty("Support_Group_ID", group.has("Support_Group_ID")
                                ? group.get("Support_Group_ID").getAsString()
                                : "");
                        supportGroup.addProperty("Support_Group_Name", group.has("Support_Group_Name")
                                ? group.get("Support_Group_Name").getAsString()
                                : "");

                        supportGroups.add(supportGroup);
                    }
                    res.add("Support_Groups", supportGroups);
                } else {
                    res.addProperty("message", "No se encontraron valores en 'getListValues'.");
                }
            } else {
                res.addProperty("message", "¡Ups! La estructura de la respuesta no es válida.");
            }
        } catch (Exception e) {
            res.addProperty("message", "Se produjo un error procesando la respuesta: " + e.getMessage());
        }

        System.out.println("Respuesta CTMSupportGroupPeopleService.java");
        System.out.println(res);

        return res;
    }

}
