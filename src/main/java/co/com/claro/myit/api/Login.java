/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

/**
 *
 * @author kompl
 */
import co.com.claro.myit.db.BannerEntity;
import co.com.claro.myit.db.SupportGroupMembersEntity;
import co.com.claro.myit.db.SupportGroupsEntity;
import co.com.claro.myit.db.UserSessionEntity;
import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonArray;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.json.JSONObject;
import com.google.gson.JsonObject;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.XML;

@Path("/loginMyIT")
public class Login {

    MySqlUtils dbUtils;

    @Context
    private ServletContext context;

    private functions fn;

    @POST
    @Produces("application/json")
    public String ingresar(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        JsonObject respuesta = new JsonObject();
        try {

            LoginRequest datos = fn.getData(data, LoginRequest.class);

            String body = Const.xmlRequest;
            body = body.replaceAll("--user--", datos.getUser());
            body = body.replaceAll("--genericUser--", datos.getUser());
            body = body.replaceAll(Pattern.quote("--genericPass--"), Matcher.quoteReplacement(datos.getPass()));
            System.out.println(body);
            boolean loginSSO = false;
            String AuthnRequestID = "";
            String AssertionID = "";

            if (haveActiveSession(datos.getUser(), datos.isCloseSessions())) {
                return fn.respError(null, "Detectamos que tienes otra sesión activa.\n Recuerda que sólo puedes tener una sesión activa a la vez ¿Deseas cerrar todas las sesiones anteriores?", true);
            }

            JSONObject resSSO = new JSONObject(this.ssoLogin(datos.getUser(), datos.getPass()));
            if (!resSSO.getBoolean("isError")) {
                resSSO = resSSO.getJSONObject("response");
                loginSSO = true;
                AuthnRequestID = resSSO.getString("AuthnRequestID");
                AssertionID = resSSO.getString("AssertionID");
            }

            responseString = fn.SoapRequest(body);
            JsonObject res = new JsonObject();

            if (responseString.equals("")) {
                return fn.respError(null, "Error al consultar información. ", responseString);
            }

            JSONObject jsonObj = XML.toJSONObject(responseString);
            respuesta = fn.getResponse(jsonObj.toString());
            if (respuesta.get("soapenv:Envelope").isJsonObject()) {
                respuesta = respuesta.get("soapenv:Envelope").getAsJsonObject();
                if (respuesta.get("soapenv:Body").isJsonObject()) {
                    respuesta = respuesta.get("soapenv:Body").getAsJsonObject();
                    if (respuesta.get("ns0:OpGetResponse").isJsonObject()) {
                        respuesta = respuesta.get("ns0:OpGetResponse").getAsJsonObject();
                        if (respuesta.has("ns0:Profile_Status") && !respuesta.get("ns0:Profile_Status").getAsString().equals("Enabled")) {
                            return fn.respError(null, "Usuario inexistente o inactivo. ", respuesta);
                        }
                        JsonObject resTok = new JsonObject();
                        resTok.addProperty("User", AES.encrypt(datos.getUser()));
                        res.addProperty("First_Name", (respuesta.has("ns0:First_Name")) ? respuesta.get("ns0:First_Name").getAsString() : "");
                        res.addProperty("Last_Name", (respuesta.has("ns0:Last_Name")) ? respuesta.get("ns0:Last_Name").getAsString() : "");
                        res.addProperty("Support_Staff", (respuesta.has("ns0:Support_Staff")) ? respuesta.get("ns0:Support_Staff").getAsString() : "");
                        res.addProperty("Organization", (respuesta.has("ns0:Organization")) ? respuesta.get("ns0:Organization").getAsString() : "");
                        res.addProperty("Profile_Status", (respuesta.has("ns0:Profile_Status")) ? respuesta.get("ns0:Profile_Status").getAsString() : "");
                        res.addProperty("Departament", (respuesta.has("ns0:Departament")) ? respuesta.get("ns0:Departament").getAsString().replaceAll("&(?!amp;)", "") : "");
                        res.addProperty("Job_Title", (respuesta.has("ns0:Job_Title")) ? respuesta.get("ns0:Job_Title").getAsString().replaceAll("&(?!amp;)", "") : "No disponible");
                        res.addProperty("Internet_Email", (respuesta.has("ns0:Internet_Email")) ? respuesta.get("ns0:Internet_Email").getAsString() : "");
                        res.addProperty("Site", (respuesta.has("ns0:Site")) ? respuesta.get("ns0:Site").getAsString() : "");
                        int User_profile = (respuesta.has("ns0:User_profile")) ? respuesta.get("ns0:User_profile").getAsInt() : 0;
                        res.addProperty("ProfileId", String.valueOf(User_profile));
                        res.addProperty("User_ID", datos.getUser());

                        res.addProperty("loginSSO", loginSSO);
                        
                        if (loginSSO) {
                            res.addProperty("AuthnRequestID", AuthnRequestID);
                            res.addProperty("AssertionID", AssertionID);
                        }
                        JSONObject ObjDataTok = new JSONObject(resTok.toString());
                        res.addProperty("token", AES.encrypt(res.toString()));
                        res.addProperty("req", AES.encrypt(ObjDataTok.toString()));

                        JsonArray grupos = new JsonArray();
                        boolean status = getContingencia();
                        //boolean status=false;
                        res.addProperty("esContingencia", status);
                        res.addProperty("esResolutor", (User_profile != 4));

                        res.addProperty("User", datos.getUser());
                        if (status && (User_profile != 4)) {
                            grupos = getSupportsGroups(datos.getUser());
                        }
                        Date date = new Date();
                        String sessionTime=String.valueOf(date.getTime());
                        res.addProperty("sessionID", sessionTime);
                        res.add("grupos", grupos);
                        res.addProperty("version", "2.0");
                        res.addProperty("tokenForm", AES.encrypt(res.toString()));
                        
                        UserSessionEntity userSessionEntity = new UserSessionEntity(datos.getUser(), sessionTime);
                        dbUtils.insert(userSessionEntity);

                        return fn.respOk(res.getAsJsonObject());
                    } else {
                        return fn.respError(null, "Combinación de usuario y contraseña incorrectos. ", respuesta);
                    }
                } else {
                    return fn.respError(null, "Combinación de usuario y contraseña incorrectos. ", respuesta);
                }
            } else {
                return fn.respError(null, "Combinación de usuario y contraseña incorrectos. ", respuesta);

            }
        } catch (Exception e) {
            return fn.respError(e, "Combinación de usuario y contraseña incorrectos. ", respuesta);
        }
    }

    public boolean haveActiveSession(String user, boolean closeSessions) {
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        Date now = new Date();
        try {
            if (closeSessions) {
                dbUtils.deleteBy("UserSessionEntity", "userID='" + user + "'");
                return false;
            }
            List res = dbUtils.readBy("UserSessionEntity", "userID='" + user + "'");
            JSONObject item;
            for (int i = 0; i < res.size(); i++) {
                item = new JSONObject(res.get(i));

                if (item.has("active") && item.getBoolean("active")) {
                    long diference = now.getTime() - Long.parseLong(item.getString("sessionTime"));
                    diference = (diference
                            / (1000 * 60))
                            % 60;
                    if (diference > 45) {
                        dbUtils.delete(res.get(i));
                        return false;
                    }
                    return true;
                }

            }
            return false;
        } catch (JSONException e) {
            return false;
        }
    }

    public boolean getContingencia() {
        boolean estado = false;
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        try {
            List res = dbUtils.read("ContingenciaEntity");

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

    public JsonArray getSupportsGroups(String user) {
        user = user.toLowerCase();
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        OracleUtils oracleUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        JsonArray resAr = new JsonArray();
        try {

            ArrayList res = (ArrayList) oracleUtils.readBy("SupportGroupMembersEntity", "usuario='" + user + "'");
            ArrayList resGroup;

            if (!res.isEmpty()) {
                SupportGroupMembersEntity memberEntity = new SupportGroupMembersEntity();
                SupportGroupsEntity groupEntity = new SupportGroupsEntity();
                for (int i = 0; i < res.size(); i++) {
                    memberEntity = new SupportGroupMembersEntity();
                    memberEntity = (SupportGroupMembersEntity) res.get(i);
                    resGroup = (ArrayList) oracleUtils.readBy("SupportGroupsEntity", "id='" + memberEntity.getIdGrupo() + "'");
                    if (!resGroup.isEmpty()) {
                        groupEntity = new SupportGroupsEntity();
                        groupEntity = (SupportGroupsEntity) resGroup.get(0);
                        resAr.add(groupEntity.getGrupo());
                    }
                }
            }
            return resAr;
        } catch (JSONException e) {
            return resAr;
        }

    }

    public String ssoLogin(String user, String pass) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd'T'HHmmss'IDM000000000'");
        SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        String id = format.format(new Date());
        String fecha = format2.format(new Date());
        String cod = Long.toString(new Date().getTime());
        cod = (cod.substring(cod.length() - 5));
        String body = Const.SAMLRequest;
        body = body.replaceAll("--ID--", id + cod);
        body = body.replaceAll("--FECHA--", fecha);
        body = Base64.getEncoder().encodeToString(body.getBytes());
        try {
            body = URLEncoder.encode(body, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.WARNING, null, ex);
        }
        String url = fn.Constanst.getLoginSSODir() + "authenticate?SAMLRequest=" + body + "&RelayState=GSIIDS";
        responseString = fn.RestRequest(url, "");
        if (responseString.equals("")) {
            return fn.respError(null, "Error al consultar información. ", responseString);
        }
        try {
            responseString = URLDecoder.decode(responseString, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException ex) {
            System.out.println(ex.toString());
        }
        JSONObject query_pairs = new JSONObject();
        String[] pairs = responseString.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(pair.substring(0, idx), pair.substring(idx + 1));
        }
        if (query_pairs.has("AuthnRequestID") && query_pairs.has("AssertionID")) {
            user = Base64.getEncoder().encodeToString(user.getBytes());
            pass = Base64.getEncoder().encodeToString(pass.getBytes());
            url = fn.Constanst.getLoginSSODir() + "authenticate?LoginName=" + user + "&Password=" + pass + "&AuthnRequestID=" + query_pairs.getString("AuthnRequestID") + "&AssertionID=" + query_pairs.getString("AssertionID");
            responseString = fn.RestRequest(url, "");
            if (responseString.equals("")) {
                return fn.respError(null, "Error al autenticar. ", responseString);
            }
            JSONObject resObj = new JSONObject();
            try {
                responseString = URLDecoder.decode(responseString, StandardCharsets.UTF_8.toString());
            } catch (UnsupportedEncodingException ex) {
                System.out.println(ex.toString());
            }
            pairs = responseString.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                resObj.put(pair.substring(0, idx), pair.substring(idx + 1));
            }
            if (resObj.has("SAMLResponse")) {
                String SAMLResponse = Base64.getDecoder().decode(resObj.getString("SAMLResponse")).toString();
                if (SAMLResponse.contains("urn:oasis:names:tc:SAML:2.0:status:Success")) {
                    JsonObject res = new JsonObject();
                    res.addProperty("AuthnRequestID", query_pairs.getString("AuthnRequestID"));
                    res.addProperty("AssertionID", query_pairs.getString("AssertionID"));
                    return fn.respOk(res.getAsJsonObject());
                } else {
                    return fn.respError(null, "Error al autenticar. ", responseString);
                }
            } else {
                return fn.respError(null, "Error al autenticar. ", responseString);
            }
        } else {
            return fn.respError(null, "Error al autenticar. ", responseString);
        }
    }

}
