/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.CTMSupportGroupPeopleRequest;
import co.com.claro.myit.api.Const;
import co.com.claro.myit.util.functions;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;


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

                        supportGroup.addProperty("Remedy_Login_ID", getElementAsString(group, "Remedy_Login_ID"));
                        supportGroup.addProperty("Support_Group_ID", getElementAsString(group, "Support_Group_ID"));
                        supportGroup.addProperty("Support_Group_Name", getElementAsString(group, "Support_Group_Name"));

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
