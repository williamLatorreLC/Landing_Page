/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import org.json.JSONObject;

/**
 *
 * @author JD
 */
@Path("/logout")
public class Logout {
    
     @Context
    private ServletContext context;
    
    private functions fn;

    @POST
    @Produces("application/json")
    public String salir(String data) {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        MySqlUtils dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        String responseString = "";
        JSONObject respuesta = new JSONObject();
        try {
            LogoutRequest datos = fn.getData(data, LogoutRequest.class);
            String info = AES.decrypt(datos.getToken());
            if (!info.isEmpty()) {
                respuesta = new JSONObject(info);
               // dbUtils.deleteBy("UserSessionEntity", "userID='"+respuesta.getString("User_ID")+"'");
                if (respuesta.getBoolean("loginSSO")) {
                    String body = Const.LogOutRequest;
                    SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    String id = respuesta.getString("AuthnRequestID");
                    String idAssert = respuesta.getString("AssertionID");
                    String fecha = format2.format(new Date());
                    body = body.replaceAll("--FECHA--", fecha);
                    body = body.replaceAll("--AuthnRequestID--", id);
                    body = body.replaceAll("--AssertionID--", idAssert);
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

                    JSONObject resObj = new JSONObject();
                    try {
                        responseString = URLDecoder.decode(responseString, StandardCharsets.UTF_8.toString());
                    } catch (UnsupportedEncodingException ex) {
                        System.out.println(ex.toString());
                    }
                    String[] pairs = responseString.split("&");
                    for (String pair : pairs) {
                        int idx = pair.indexOf("=");
                        resObj.put(pair.substring(0, idx), pair.substring(idx + 1));
                    }
                    if (resObj.has("SAMLResponse")) {
                        String SAMLResponse = Base64.getDecoder().decode(resObj.getString("SAMLResponse")).toString();
                        if (SAMLResponse.contains("urn:oasis:names:tc:SAML:2.0:status:Success")) {
                            return fn.respOk("OK");
                        } else {
                            return fn.respError(null, "Error al cerrar sesión. ", responseString);
                        }
                    } else {
                        return fn.respError(null, "Error al cerrar sesión. ", responseString);
                    }
                } else {
                    return fn.respOk("OK");
                }
            } else {
                return fn.respError(null, "Error al obtener información. ", respuesta);
            }
        } catch (Exception e) {
            return fn.respError(e, "Error al obtener información. ", respuesta);
        }
    }
}
