/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import static co.com.claro.myit.util.functions.getData;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import java.util.List;
import org.json.JSONObject;

/**
 *
 * @author JD
 */
@Path("/utils")
public class DecUtil{
    
    MySqlUtils dbUtils;
    
    @Context
    private ServletContext context;
    
    private functions fn;

    @POST
    @Path("/dec")
    @Produces("application/json")
    public String enc(String data) {
      JSONObject respuesta = new JSONObject();
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        try {
            LogoutRequest datos = getData(data, LogoutRequest.class);
            String info = AES.decrypt(datos.getToken());
            if (!info.isEmpty()) {
                respuesta = new JSONObject(info);
                if(respuesta.getString("sessionID")!=null){
                    String sessionID=respuesta.getString("sessionID");
                     List res = dbUtils.readBy("UserSessionEntity", "sessionTime='" + sessionID + "'");
                     if(!res.isEmpty()){
                        return fn.respOk(respuesta);
                     }
                }
                return fn.respError(null, "Sesion invalida.", respuesta);
            } else {
                return fn.respError(null, "Error al obtener información. ", respuesta);
            }
        } catch (Exception e) {
            return fn.respError(e, "Error al obtener información. ", respuesta);
        }
    }
}
