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
import co.com.claro.myit.db.SupportGroupMembersEntity;
import co.com.claro.myit.db.SupportGroupsEntity;
import co.com.claro.myit.db.UserSessionEntity;
import co.com.claro.myit.service.LoginService;
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
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;
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
            
            byte[] decodedU = Base64.getDecoder().decode(datos.getUser());
            String decodedUser = new String(decodedU, StandardCharsets.UTF_8);
           
            byte[] decodedP = Base64.getDecoder().decode(datos.getPass());
            String decodedPass = new String(decodedP, StandardCharsets.UTF_8);
            
            datos.setUser(decodedUser);
            datos.setPass(decodedPass);
            
            boolean isContingencia = getContingenciaLogin();
            LoginService loginService=new LoginService(datos,fn,isContingencia);
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
            responseString = loginService.login();

            if (responseString.equals("")) {
                return fn.respError(null, "Error al consultar información. ", responseString);
            }

            JSONObject jsonObj = XML.toJSONObject(responseString);
            respuesta = fn.getResponse(jsonObj.toString());
            if (respuesta.get("Envelope").isJsonObject()) {
                respuesta = respuesta.get("Envelope").getAsJsonObject();
                if (respuesta.get("Body").isJsonObject()) {
                    respuesta = respuesta.get("Body").getAsJsonObject();
                    if (respuesta.get("OpGetResponse").isJsonObject()) {
                        respuesta = respuesta.get("OpGetResponse").getAsJsonObject();
                        JsonObject resTok = new JsonObject();
                        resTok.addProperty("User", AES.encrypt(datos.getUser()));
                        JsonObject res = loginService.getBody(respuesta);

                        if (res.has("Profile_Status") && !res.get("Profile_Status").getAsString().equals("Enabled")) {
                            return fn.respError(null, "Usuario inexistente o inactivo. ", respuesta);
                        }
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

                        res.addProperty("esContingencia", status);
                        res.addProperty("esResolutor", (loginService.userProfile != 4));

                        res.addProperty("User", datos.getUser());
                        if (status && (loginService.userProfile != 4)) {
                            grupos = getSupportsGroups(datos.getUser());
                        }
                        Date date = new Date();
                        String sessionTime=String.valueOf(date.getTime());
                        res.addProperty("sessionID", sessionTime);
                        res.addProperty("AvatarTime", fn.Constanst.getAvatarTime());
                        res.addProperty("BannerTime", fn.Constanst.getBannerTime());
                        res.addProperty("MyItStore", fn.Constanst.getMyItStore());
                        res.addProperty("MyItUser", fn.Constanst.getMyItUser());
                        res.addProperty("MyItResolutor", fn.Constanst.getMyItResolutor());
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
            List res = dbUtils.readBy("ContingenciaEntity","tipo='Casos'");

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

    public boolean getContingenciaLogin() {
        boolean estado = false;
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        try {
            List res = dbUtils.readBy("ContingenciaEntity","tipo='Login'");

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
