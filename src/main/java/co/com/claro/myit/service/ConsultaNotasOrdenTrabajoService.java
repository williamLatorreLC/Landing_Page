/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaNotasOrdenTrabajoRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 *
 * @author dussan.palma
 */
public class ConsultaNotasOrdenTrabajoService {

    private final ConsultaNotasOrdenTrabajoRequest data;

    private functions fn;

    public ConsultaNotasOrdenTrabajoService(ConsultaNotasOrdenTrabajoRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String consultarNotasWO() {
        String body = "";

        body = Const.xmlRequestNotasConsultaWO;
        body = body.replaceAll("--wo--", this.data.getWoNumber());
        return this.fn.SoapRequestConsutaNotasWO(body, false);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        JsonObject envelope = respuesta.getAsJsonObject("Envelope");
        JsonObject body = envelope.getAsJsonObject("Body");

        if (body.has("Fault")) {
            // Hay un error, devolvemos el mensaje de error
            res.addProperty("message", "¡Ups! Parece que este caso no existe. Te sugiero revisar esta información.");
        } else {
            JsonObject getListResponse = body.getAsJsonObject("GetListResponse");

            JsonArray listValues = getListResponse.getAsJsonArray("getListValues");

            // Filtrar los elementos con "View_Access": "Public"
            JsonArray publicListValues = new JsonArray();
            for (int i = 0; i < listValues.size(); i++) {
                JsonObject item = listValues.get(i).getAsJsonObject();
                if (item.has("View_Access") && "Public".equals(item.get("View_Access").getAsString())) {
                    publicListValues.add(item);
                }
            }

            int totalListValues = publicListValues.size();
            int startIndex = Math.max(0, totalListValues - 3); // Últimas 3 getListValues o menos si hay menos de 3

            JsonArray lastThreeListValues = new JsonArray();
            for (int i = startIndex; i < totalListValues; i++) {
                lastThreeListValues.add(publicListValues.get(i));
            }

            res.add("lastThreeListValues", lastThreeListValues);
        }

        System.out.println(res);
        return res;
    }

}
