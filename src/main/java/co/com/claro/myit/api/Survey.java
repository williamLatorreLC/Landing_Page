/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.service.SurveyService;
import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
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
            boolean isContingencia = this.getContingenciaSurvey();
            SurveyService surveyService = new SurveyService(datos, fn, isContingencia);
            if (!info.isEmpty()) {
                infoTok = new JSONObject(info);
                
                responseString = surveyService.getSurvey(AES.decrypt(infoTok.getString("User")));
                JsonObject res = new JsonObject();
                
                if (responseString.equals("")) {
                    return fn.respError(null, "Error al consultar información. ", responseString);
                }
                responseString = this.removeSoapTags(responseString);
                if(responseString.contains("headerError")){
                    return fn.respError(null, "No Tienes encuantas pendientes por responder.", respuesta);
                }
                JSONObject jsonObj = XML.toJSONObject(responseString);
                respuesta = fn.getResponse(jsonObj.toString());
                if (respuesta.has("Envelope") && respuesta.get("Envelope").isJsonObject()) {
                    respuesta = respuesta.get("Envelope").getAsJsonObject();
                    if (respuesta.get("Body").isJsonObject()) {
                        respuesta = respuesta.get("Body").getAsJsonObject();
                        return surveyService.listSurveysResponse(respuesta);
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
             boolean isAes = this.getContingenciaSurvey();
            SurveyService surveyService = new SurveyService(datos, fn, isAes);
            
            responseString = surveyService.setSurvey(datos);
            
            if (responseString.equals("")) {
                return fn.respError(null, "Error al consultar información. ", responseString);
            }
            responseString = this.removeSoapTags(responseString);
            if(responseString.contains("headerError")){
                return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente.. ", respuesta);
            }
            JSONObject jsonObj = XML.toJSONObject(responseString);
            respuesta = fn.getResponse(jsonObj.toString());
            if (respuesta.get("Envelope").isJsonObject()) {
                respuesta = respuesta.get("Envelope").getAsJsonObject();
                if (respuesta.get("Body").isJsonObject()) {
                    respuesta = respuesta.get("Body").getAsJsonObject();
                    return surveyService.answerResponse(respuesta);
                } else {
                    return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente. ", respuesta);
                }
            } else {
                return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente. ", respuesta);
                
            }
            
        } catch (JSONException e) {
            return fn.respError(e, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
        } catch (Exception e) {
            return fn.respError(e, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
        }
    }
    
    private boolean getContingenciaSurvey() {
        boolean estado = false;
        MySqlUtils dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        try {
            List res = dbUtils.readBy("ContingenciaEntity", "tipo='Surveys'");
            
            if (!res.isEmpty()) {
                JSONObject item = new JSONObject(res.get(0));
                if (item.has("estado")) {
                    estado = (item.getInt("estado") == 1);
                }
            }
            return estado;
        } catch (JSONException e) {
            return false;
        }
        
    }
    
    private String removeSoapTags(String responseString){
        responseString = responseString.replaceAll("ns0:", "");
        responseString = responseString.replaceAll("ns1:", "");
        responseString = responseString.replaceAll("ns2:", "");
        responseString = responseString.replaceAll("S:", "");
        responseString = responseString.replaceAll("s:", "");
        responseString = responseString.replaceAll("soapenv:", "");
        responseString = responseString.replaceAll("Soapenv:", "");
        return responseString;
    }
    
    
}
