/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaHistoricoRequerimientosRequest;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 *
 * @author dussan.palma
 */
public class ConsultaHistoricoRequerimientosService {

    private final ConsultaHistoricoRequerimientosRequest data;

    private functions fn;

    public ConsultaHistoricoRequerimientosService(ConsultaHistoricoRequerimientosRequest data, functions fn) {
        this.data = data;
        this.fn = fn;
    }

    public String ConsultaHistoricoRequerimientos() {
        String body = "";

        body = Const.xmlRequestSRMRequestGetList;
        body = body.replaceAll("--qa--", this.data.getQualification());
        return this.fn.SoapRequestHistoricoRequerimientos(body, false);
    }

    public JsonObject getBody(JsonObject respuesta) {
        JsonObject res = new JsonObject();

        JsonObject getListResponse = respuesta.getAsJsonObject("Envelope")
                .getAsJsonObject("Body")
                .getAsJsonObject("GetListResponse");

        JsonArray listValues = getListResponse.getAsJsonArray("getListValues");

        // Copiar elementos de JsonArray a una lista de Java
        List<JsonObject> listValuesList = new ArrayList<>();
        for (int i = 0; i < listValues.size(); i++) {
            listValuesList.add(listValues.get(i).getAsJsonObject());
        }

        // Ordenar la lista por fecha de presentación
        Collections.sort(listValuesList, new ListComparator());

        int totalListValues = listValuesList.size();
        int startIndex = Math.max(0, totalListValues - 3); // Últimas 3 getListValues o menos si hay menos de 3

        JsonArray lastThreeListValues = new JsonArray();
        for (int i = startIndex; i < totalListValues; i++) {
            lastThreeListValues.add(listValuesList.get(i));
        }

        res.add("lastThreeListValues", lastThreeListValues);

        System.out.println(res);
        return res;
    }

    private static class ListComparator implements Comparator<JsonObject> {

        @Override
        public int compare(JsonObject o1, JsonObject o2) {
            String date1 = o1.getAsJsonPrimitive("Submit_Date").getAsString();
            String date2 = o2.getAsJsonPrimitive("Submit_Date").getAsString();
            return date1.compareTo(date2);
        }
    }
}
