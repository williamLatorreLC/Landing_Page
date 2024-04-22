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

        JsonObject getListResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetListResponse");

        JsonArray listValues = getListResponse.getAsJsonArray("getListValues");

        int totalListValues = listValues.size();
        int startIndex = Math.max(0, totalListValues - 3); // Últimas 3 getListValues o menos si hay menos de 3

        JsonArray lastThreeListValues = new JsonArray();
        for (int i = startIndex; i < totalListValues; i++) {
            lastThreeListValues.add(listValues.get(i));
        }

        res.add("lastThreeListValues", lastThreeListValues);

        System.out.println(res);
        return res;
    }

}
