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

        // Validar si la estructura principal existe
        if (respuesta.has("Envelope")
                && respuesta.getAsJsonObject("Envelope").has("Body")
                && respuesta.getAsJsonObject("Envelope").getAsJsonObject("Body").has("GetResponse")) {

            JsonObject getResponse = respuesta.getAsJsonObject("Envelope")
                    .getAsJsonObject("Body")
                    .getAsJsonObject("GetResponse");

            // Validar y agregar cada propiedad individualmente
            if (getResponse.has("Id_Area_CA")) {
                res.addProperty("Id_Area_CA", getResponse.get("Id_Area_CA").getAsString());
            } else {
                res.addProperty("Id_Area_CA", "");
            }

            if (getResponse.has("Id_Gerencia_CA")) {
                res.addProperty("Id_Gerencia_CA", getResponse.get("Id_Gerencia_CA").getAsString());
            } else {
                res.addProperty("Id_Gerencia_CA", "");
            }

            if (getResponse.has("Id_Comite_CA")) {
                res.addProperty("Id_Comite_CA", getResponse.get("Id_Comite_CA").getAsString());
            } else {
                res.addProperty("Id_Comite_CA", "");
            }

            if (getResponse.has("Contact_Type")) {
                res.addProperty("Contact_Type", getResponse.get("Contact_Type").getAsString());
            } else {
                res.addProperty("Contact_Type", "");
            }
        } else {
            res.addProperty("message", "¡Ups! La estructura de la respuesta no es válida.");
        }

        System.out.println("Respuesta CTMPeopleWsGetService.java");
        System.out.println(res);

        return res;
    }

    private String getElementAsString(JsonObject jsonObject, String key) {
        if (jsonObject.has(key)) {
            JsonElement element = jsonObject.get(key);
            if (element.isJsonPrimitive()) {
                return element.getAsString();
            } else if (element.isJsonObject()) {
                JsonObject obj = element.getAsJsonObject();
                // Verificar si tiene el atributo '@xsi:nil' y su valor es 'true'
                if (obj.has("@xsi:nil") && obj.get("@xsi:nil").getAsString().equals("true")) {
                    return ""; // Retornar cadena vacía o null según tus necesidades
                } else {
                    // Si el objeto tiene un valor en texto, extraerlo
                    if (obj.has("#text")) {
                        return obj.get("#text").getAsString();
                    } else {
                        // Manejar otros casos si es necesario
                        return "";
                    }
                }
            } else {
                // Manejar otros tipos (JsonArray, etc.) si es necesario
                return "";
            }
        } else {
            return ""; // Retornar cadena vacía si la clave no existe
        }
    }

}
