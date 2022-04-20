/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author kompl
 */
@Path("/surveys")
@Produces(MediaType.APPLICATION_JSON)
public class Survey {

    @Context
    private ServletContext context;

    private functions fn;

    @POST
    @Path("/GetList")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String get_list(String data) throws JSONException {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        JSONObject infoTok = new JSONObject();
        try {
            LogoutRequest datos = fn.getData(data, LogoutRequest.class);
            String info = AES.decrypt(datos.getToken());
            if (!info.isEmpty()) {
                infoTok = new JSONObject(info);
                String body = "<soapenv:Envelope "
                        + "xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" "
                        + "xmlns:urn=\"urn:SRM_Survey\">\n"
                        + "   <soapenv:Header>\n"
                        + "      <urn:AuthenticationInfo>\n"
                        + "         <urn:userName>" + fn.Constanst.getGenericUser() + "</urn:userName>\n"
                        + "         <urn:password>" + fn.Constanst.getGenericPass() + "</urn:password>\n"
                        + "      </urn:AuthenticationInfo>\n"
                        + "   </soapenv:Header>\n"
                        + "   <soapenv:Body>\n"
                        + "      <urn:GetList>\n"
                        + "         <urn:Qualification>--user--</urn:Qualification>\n"
                        + "      </urn:GetList>\n"
                        + "   </soapenv:Body>\n"
                        + "</soapenv:Envelope>";
                body = body.replaceAll("--user--", AES.decrypt(infoTok.getString("User")));

                responseString = fn.SoapRequestSurvey(body, "Get");
                JsonObject res = new JsonObject();
                JsonArray resList = new JsonArray();
                JSONArray finalList = new JSONArray();

                if (responseString.equals("")) {
                    return fn.respError(null, "Error al consultar información. ", responseString);
                }
                responseString = responseString.replaceAll("ns0:", "");
                JSONObject jsonObj = XML.toJSONObject(responseString);
                respuesta = fn.getResponse(jsonObj.toString());
                if (respuesta.has("soapenv:Envelope") && respuesta.get("soapenv:Envelope").isJsonObject()) {
                    respuesta = respuesta.get("soapenv:Envelope").getAsJsonObject();
                    if (respuesta.get("soapenv:Body").isJsonObject()) {
                        respuesta = respuesta.get("soapenv:Body").getAsJsonObject();
                        if (respuesta.has("GetListResponse") && respuesta.get("GetListResponse").isJsonObject()) {
                            respuesta = respuesta.get("GetListResponse").getAsJsonObject();
                            if (respuesta.get("getListValues").isJsonArray()) {
                                resList = respuesta.getAsJsonArray("getListValues");
                            } else if (respuesta.get("getListValues").isJsonObject()) {
                                resList.add(respuesta.getAsJsonObject("getListValues"));
                            }

                            if (resList.size() > 0) {
                                String[] reqSurvery;
                                for (int i = 0; i < resList.size(); i++) {
                                    JSONObject item = new JSONObject(resList.get(i).getAsJsonObject().toString());
                                    reqSurvery = item.getString("SurveyFor").split("\\(");
                                    item.put("showDetails", false);
                                     item.put("SurveyFor", item.getString("Case_Description") + " " + item.getString("Originating_Request_ID"));
                                    if (reqSurvery.length > 1) {
                                        item.put("SurveyReq", reqSurvery[1].replaceAll("\\)", "").trim());
                                    } else {
                                        item.put("SurveyReq", "");
                                    }
                                    finalList.put(item);
                                }
                                JsonElement elem = JsonParser.parseString(finalList.toString());
                                return fn.respOk(elem.getAsJsonArray());
                            }
                            return fn.respOk(resList);
                        } else {
                            return fn.respError(null, "No tienes encuestas pendientes por responder. ", respuesta);
                        }
                    } else {
                        return fn.respError(null, "No tienes encuestas pendientes por responder. ", respuesta);
                    }
                } else {
                    return fn.respError(null, "Error de credenciales combinación de usuario y contraseña incorrectos. ", respuesta);

                }
            } else {
                return fn.respError(null, "Error al obtener información. ", respuesta);
            }

        } catch (JSONException e) {
            return fn.respError(e, "Error de credenciales combinación de usuario y contraseña incorrectos. ", respuesta);
        }
    }

    @POST
    @Path("/GetDetails")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String get_details(String data) throws JSONException {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        JSONObject datos = new JSONObject(data);
        try {

            String body = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                    + "    <Header>\n"
                    + "        <AuthenticationInfo xmlns=\"urn:SRM_Request\">\n"
                    + "            <userName>" + fn.Constanst.getGenericUser() + "</userName>\n"
                    + "            <password>" + fn.Constanst.getGenericPass() + "</password>\n"
                    + "        </AuthenticationInfo>\n"
                    + "    </Header>\n"
                    + "    <Body>\n"
                    + "        <Get xmlns=\"urn:SRM_Request\">\n"
                    + "            <Service_Request_Number>--req--</Service_Request_Number>\n"
                    + "        </Get>\n"
                    + "    </Body>\n"
                    + "</Envelope>";
            body = body.replaceAll("--req--", datos.getJSONObject("data").getString("reqNumber"));

            responseString = fn.SoapRequestForDetails(body, "GetInc");

            if (responseString.equals("")) {
                return fn.respError(null, "Error al consultar información. ", responseString);
            }
            responseString = responseString.replaceAll("ns0:", "");
            JSONObject jsonObj = XML.toJSONObject(responseString);
            respuesta = fn.getResponse(jsonObj.toString());
            if (respuesta.has("soapenv:Envelope") && respuesta.get("soapenv:Envelope").isJsonObject()) {
                respuesta = respuesta.get("soapenv:Envelope").getAsJsonObject();
                if (respuesta.get("soapenv:Body").isJsonObject()) {
                    respuesta = respuesta.get("soapenv:Body").getAsJsonObject();
                    if (respuesta.has("GetResponse") && respuesta.get("GetResponse").isJsonObject()) {
                        respuesta = respuesta.get("GetResponse").getAsJsonObject();
                        boolean isWO = false;
                        if (respuesta.get("AppRequestID").getAsString().isEmpty()) {
                            return fn.respError(null, "No se encontrò un nùmero de incidente valido. ", respuesta);
                        }
                        if (respuesta.get("AppRequestID").getAsString().startsWith("INC")) {
                            body = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                                    + "    <Header>\n"
                                    + "        <AuthenticationInfo xmlns=\"urn:HPD_HelpDesk_WS\">\n"
                                    + "            <userName>" + fn.Constanst.getGenericUser() + "</userName>\n"
                                    + "            <password>" + fn.Constanst.getGenericPass() + "</password>\n"
                                    + "        </AuthenticationInfo>\n"
                                    + "    </Header>\n"
                                    + "    <Body>\n"
                                    + "        <Get xmlns=\"urn:HPD_HelpDesk_WS\">\n"
                                    + "            <Incident_Number>" + respuesta.get("AppRequestID").getAsString() + "</Incident_Number>\n"
                                    + "        </Get>\n"
                                    + "    </Body>\n"
                                    + "</Envelope>";
                            responseString = fn.SoapRequestForDetails(body, "GetDetINC");
                        } else {
                            body = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\n"
                                    + "    <Header>\n"
                                    + "        <AuthenticationInfo xmlns=\"urn:WOI_WorkOrder_WS\">\n"
                                    + "            <userName>" + fn.Constanst.getGenericUser() + "</userName>\n"
                                    + "            <password>" + fn.Constanst.getGenericPass() + "</password>\n"
                                    + "        </AuthenticationInfo>\n"
                                    + "    </Header>\n"
                                    + "    <Body>\n"
                                    + "        <Get xmlns=\"urn:WOI_WorkOrder_WS\">\n"
                                    + "            <Work_Order_Number>" + respuesta.get("AppRequestID").getAsString() + "</Work_Order_Number>\n"
                                    + "        </Get>\n"
                                    + "    </Body>\n"
                                    + "</Envelope>";
                            responseString = fn.SoapRequestForDetails(body, "GetDetWO");
                            isWO = true;
                        }

                        if (responseString.equals("")) {
                            return fn.respError(null, "Error al consultar el detalle del incidente. ", responseString);
                        }
                        responseString = responseString.replaceAll("ns0:", "");
                        jsonObj = XML.toJSONObject(responseString);
                        respuesta = fn.getResponse(jsonObj.toString());
                        if (respuesta.has("soapenv:Envelope") && respuesta.get("soapenv:Envelope").isJsonObject()) {
                            respuesta = respuesta.get("soapenv:Envelope").getAsJsonObject();
                            if (respuesta.get("soapenv:Body").isJsonObject()) {
                                respuesta = respuesta.get("soapenv:Body").getAsJsonObject();
                                if (respuesta.has("GetResponse") && respuesta.get("GetResponse").isJsonObject()) {
                                    respuesta = respuesta.get("GetResponse").getAsJsonObject();
                                    if (!isWO) {
                                        return fn.respOk(respuesta.get("Detailed_Decription").getAsString());
                                    } else {
                                        return fn.respOk(respuesta.get("Detailed_Description").getAsString());
                                    }
                                } else {
                                    return fn.respError(null, "Error al consultar el detalle del incidente. ", respuesta);
                                }
                            } else {
                                return fn.respError(null, "Error al consultar el detalle del incidente. ", respuesta);
                            }
                        } else {
                            return fn.respError(null, "Error de credenciales combinación de usuario y contraseña incorrectos. ", respuesta);

                        }
                    } else {
                        return fn.respError(null, "Error al consultar el detalle del incidente. ", respuesta);
                    }
                } else {
                    return fn.respError(null, "Error al consultar el detalle del incidente. ", respuesta);
                }
            } else {
                return fn.respError(null, "Error de credenciales combinación de usuario y contraseña incorrectos. ", respuesta);

            }

        } catch (JSONException e) {
            return fn.respError(e, "Error de credenciales combinación de usuario y contraseña incorrectos. ", respuesta);
        }
    }

    @POST
    @Path("/Set")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String set_answer(String data) throws JSONException {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        JSONObject infoTok = new JSONObject();
        try {
            SurveyRequest datos = fn.getData(data, SurveyRequest.class);
            String info = AES.decrypt(datos.getToken());
            if (!info.isEmpty()) {
                infoTok = new JSONObject(info);
                String body = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:SRM_Survey\">\n"
                        + "   <soapenv:Header>\n"
                        + "      <urn:AuthenticationInfo>\n"
                        + "         <urn:userName>" + fn.Constanst.getGenericUser() + "</urn:userName>\n"
                        + "         <urn:password>" + fn.Constanst.getGenericPass() + "</urn:password>\n"
                        + "      </urn:AuthenticationInfo>\n"
                        + "   </soapenv:Header>\n"
                        + "   <soapenv:Body>\n"
                        + "      <urn:Set>\n"
                        + "         <urn:Survey_ID>--id--</urn:Survey_ID>\n"
                        + "         <urn:Status_>Responded</urn:Status_>\n"
                        + "         <urn:Q1-1-10>--valor--</urn:Q1-1-10>\n"
                        + "         <urn:Comment_1>--comment--</urn:Comment_1>\n"
                        + "      </urn:Set>\n"
                        + "   </soapenv:Body>\n"
                        + "</soapenv:Envelope>";
                body = body.replaceAll("--user--", AES.decrypt(infoTok.getString("User")));
                body = body.replaceAll("--id--", datos.getId());
                body = body.replaceAll("--valor--", datos.getCalificacion());
                body = body.replaceAll("--comment--", datos.getComentario());

                responseString = fn.SoapRequestSurvey(body, "Set");

                if (responseString.equals("")) {
                    return fn.respError(null, "Error al consultar información. ", responseString);
                }
                responseString = responseString.replaceAll("ns0:", "");
                JSONObject jsonObj = XML.toJSONObject(responseString);
                respuesta = fn.getResponse(jsonObj.toString());
                if (respuesta.get("soapenv:Envelope").isJsonObject()) {
                    respuesta = respuesta.get("soapenv:Envelope").getAsJsonObject();
                    if (respuesta.get("soapenv:Body").isJsonObject()) {
                        respuesta = respuesta.get("soapenv:Body").getAsJsonObject();
                        if (respuesta.has("SetResponse") && respuesta.get("SetResponse").isJsonObject()) {
                            respuesta = respuesta.get("SetResponse").getAsJsonObject();
                            if (respuesta.has("Survey_ID")) {
                                return fn.respOk("OK");
                            } else {
                                return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
                            }
                        } else {
                            return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
                        }
                    } else {
                        return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente. ", respuesta);
                    }
                } else {
                    return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente. ", respuesta);

                }
            } else {
                return fn.respError(null, "Error al obtener información. ", respuesta);
            }
        } catch (JSONException e) {
            return fn.respError(e, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
        }
    }

}
