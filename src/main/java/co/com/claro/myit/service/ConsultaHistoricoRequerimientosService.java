/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.Const;
import co.com.claro.myit.api.ConsultaHistoricoRequerimientosRequest;
import co.com.claro.myit.util.functions;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
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

        try {


            JsonObject envelope = respuesta.getAsJsonObject("Envelope");
            JsonObject body = envelope.getAsJsonObject("Body");

            if (body.has("Fault")) {
                res.addProperty("message", "Ups, parece que no has creado casos.");
                return res;
            }

            JsonObject getListResponse = body.getAsJsonObject("GetListResponse");

            JsonArray listValues = getListResponse.getAsJsonArray("getListValues");
            List<JsonObject> listValuesList = new ArrayList<>();
            for (int i = 0; i < listValues.size(); i++) {
                listValuesList.add(listValues.get(i).getAsJsonObject());
            }

            Collections.sort(listValuesList, new ListComparator());

            int totalListValues = listValuesList.size();
            int startIndex = Math.max(0, totalListValues - 5);

            JsonArray lastFiveListValues = new JsonArray();
            for (int i = startIndex; i < totalListValues; i++) {
                lastFiveListValues.add(listValuesList.get(i));
            }

            res.add("lastFiveListValues", lastFiveListValues);
        } catch (Exception e) {
            res.addProperty("message", "Se produjo un error al procesar la respuesta: " + e.getMessage());
        }

        System.out.println("Respuesta ConsultaCasosService.java línea 55");
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
