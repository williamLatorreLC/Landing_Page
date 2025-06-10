/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.service;

import co.com.claro.myit.api.LogoutRequest;
import co.com.claro.myit.api.SurveyRequest;
import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.functions;
import com.fasterxml.jackson.core.JsonParser;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;


/**
 *
 * @author jcabarcas
 */
public class SurveyService {

    private final LogoutRequest data;

    private final SurveyRequest datos;

    private functions fn;

    private boolean isContingencia;

    public int userProfile = 0;

    public SurveyService(LogoutRequest data, functions fn, boolean isContingencia) {
        this.datos = null;
        this.data = data;
        this.fn = fn;
        this.isContingencia = isContingencia;
    }

    public SurveyService(SurveyRequest data, functions fn, boolean isContingencia) {
        this.datos = data;
        this.data = null;
        this.fn = fn;
        this.isContingencia = isContingencia;
    }

    public String getSurvey(String user) {
        String body = "";
        if (this.isContingencia) {
            body = "<soapenv:Envelope "
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
            body = body.replaceAll("--user--", user);
            
        } else {
            try {
                body = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soap=\"http://soap.service.wscusprobinquiryv1.claro.com.co/\">\n"
                        + "   <soapenv:Header>\n"
                        + "      <soap:headerRequest>\n"
                        + "         <user>" + AES.encryptMethod(fn.Constanst.getGenericUser()) + "</user>\n"
                        + "         <password>" + AES.encryptMethod(fn.Constanst.getGenericPass()) + "</password>\n"
                        + "      </soap:headerRequest>\n"
                        + "   </soapenv:Header>\n"
                        + "   <soapenv:Body>\n"
                        + "      <soap:getPendingInquiryCusProbRequest>\n"
                        + "         <qualification>" + AES.encryptMethod(user) + "</qualification>\n"
                        + "      </soap:getPendingInquiryCusProbRequest>\n"
                        + "   </soapenv:Body>\n"
                        + "</soapenv:Envelope>";
                System.out.println("Request:");
                System.out.println(body);
            } catch (BadPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IllegalBlockSizeException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchPaddingException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (NoSuchAlgorithmException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidAlgorithmParameterException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            } catch (InvalidKeyException ex) {
                Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        System.out.println("Request");
        System.out.println(body);
        return fn.SoapRequestSurvey(body, "Get", !this.isContingencia);
    }

    public String setSurvey(SurveyRequest datos) throws Exception {
        String body = "";
        String info = AES.decrypt(datos.getToken());
        if (!info.isEmpty()) {
            JSONObject infoTok = new JSONObject(info);
            if (this.isContingencia) {
                body = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:SRM_Survey\">\n"
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
                body = body.replaceAll("--id--", datos.getId());
                body = body.replaceAll("--valor--", datos.getCalificacion());
                body = body.replaceAll("--comment--", datos.getComentario());
            } else {
                body = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soap=\"http://soap.service.wscusprobinquiryv1.claro.com.co/\">\n"
                        + "   <soapenv:Header>\n"
                        + "      <soap:headerRequest>\n"
                        + "         <user>" + AES.encryptMethod(fn.Constanst.getGenericUser()) + "</user>\n"
                        + "         <password>" + AES.encryptMethod(fn.Constanst.getGenericPass()) + "</password>\n"
                        + "      </soap:headerRequest>\n"
                        + "   </soapenv:Header>\n"
                        + "   <soapenv:Body>\n"
                        + "      <soap:setInquiryCusProbRequest>\n"
                        + "         <surveyID>--id--</surveyID>\n"
                        + "         <status>--status--</status>\n"
                        + "         <q1110>--valor--</q1110>\n"
                        + "         <comment1>--comment--</comment1>\n"
                        + "         <lastSurveyedDate>--fecha--</lastSurveyedDate>\n"
                        + "      </soap:setInquiryCusProbRequest>\n"
                        + "   </soapenv:Body>\n"
                        + "</soapenv:Envelope>";
                body = body.replaceAll("--id--", AES.encryptMethod(datos.getId()));
                body = body.replaceAll("--valor--", AES.encryptMethod(datos.getCalificacion()));
                body = body.replaceAll("--comment--", AES.encryptMethod(datos.getComentario()));
                body = body.replaceAll("--fecha--", AES.encryptMethod(datos.getFecha()));
                body = body.replaceAll("--status--", AES.encryptMethod("Responded"));
                System.out.println("Request:");
                System.out.println(body);
            }

            return fn.SoapRequestSurvey(body, "Set", !this.isContingencia);
        } else {
            throw new Exception("error al obtener informacion");
        }
    }

    public String listSurveysResponse(JsonObject respuesta) {
        JsonArray resList = new JsonArray();
        if (this.isContingencia) {
            if (respuesta.has("GetListResponse") && respuesta.get("GetListResponse").isJsonObject()) {
                respuesta = respuesta.get("GetListResponse").getAsJsonObject();
            } else {
                return fn.respError(null, "No tienes encuestas pendientes por responder. ", respuesta);
            }
        } else {
            if (respuesta.has("getPendingInquiryCusProbResponse") && respuesta.get("getPendingInquiryCusProbResponse").isJsonObject()) {
                respuesta = respuesta.get("getPendingInquiryCusProbResponse").getAsJsonObject();
            } else {
                return fn.respError(null, "No tienes encuestas pendientes por responder. ", respuesta);
            }
        }
        if (respuesta.get("getListValues").isJsonArray()) {
            resList = respuesta.getAsJsonArray("getListValues");
        } else if (respuesta.get("getListValues").isJsonObject()) {
            resList.add(respuesta.getAsJsonObject("getListValues"));
        }
        if (resList.size() > 0) {
            return this.mapResponse(resList);
        }
        return fn.respOk(resList);
    }

    public String answerResponse(JsonObject respuesta) {
        if (this.isContingencia) {
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
            if (respuesta.has("setInquiryCusProbResponse") && respuesta.get("setInquiryCusProbResponse").isJsonObject()) {
                respuesta = respuesta.get("setInquiryCusProbResponse").getAsJsonObject();
                if (respuesta.has("surveyID")) {
                    return fn.respOk("OK");
                } else {
                    return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
                }
            } else {
                return fn.respError(null, "Error al registrar tu respuesta inténtalo nuevamente.", respuesta);
            }
        }
    }

    private String mapResponse(JsonArray resList) {
        JSONArray finalList = new JSONArray();
        String[] reqSurvery;
        for (int i = 0; i < resList.size(); i++) {
            JSONObject item = new JSONObject(resList.get(i).getAsJsonObject().toString());
            item.put("showDetails", false);
            if (!this.isContingencia) {
                try {
                    item.put("SurveyFor", (item.has("surveyFor")) ? AES.decryptMethod(item.getString("surveyFor")) : "");
                    item.put("Case_Description", (item.has("caseDescription")) ? AES.decryptMethod(item.getString("caseDescription")) : "");
                    item.put("Survey_ID", (item.has("surveyID")) ? AES.decryptMethod(item.getString("surveyID")) : "");
                    item.put("Originating_Request_ID", (item.has("originatingRequestID")) ? AES.decryptMethod(item.getString("originatingRequestID")) : "");
                    item.put("Status", (item.has("status")) ? AES.decryptMethod(item.getString("status")) : "");
                    item.put("Create_date", (item.has("createDate")) ? AES.decryptMethod(item.getString("createDate")) : "");
                    item.put("Survey_Name1", (item.has("surveyName1")) ? AES.decryptMethod(item.getString("surveyName1")) : "");
                    item.put("Last_Surveyed_Date", (item.has("lastSurveyedDate")) ? AES.decryptMethod(item.getString("lastSurveyedDate")) : "");
                    item.put("Login_ID", (item.has("loginID")) ? AES.decryptMethod(item.getString("loginID")) : "");
                } catch (BadPaddingException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (IllegalBlockSizeException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (NoSuchPaddingException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (NoSuchAlgorithmException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (InvalidAlgorithmParameterException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                } catch (InvalidKeyException ex) {
                    Logger.getLogger(LoginService.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            reqSurvery = item.getString("SurveyFor").split("\\(");
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
}
