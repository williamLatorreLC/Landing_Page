/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.AES;
import co.com.claro.myit.util.functions;
import static co.com.claro.myit.util.functions.getData;
import com.google.gson.JsonObject;
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
@Path("/utils")
public class DecUtil{
    
    @Context
    private ServletContext context;
    
    private functions fn;

    @POST
    @Path("/dec")
    @Produces("application/json")
    public String enc(String data) {
        JSONObject respuesta = new JSONObject();
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        try {
            LogoutRequest datos = getData(data, LogoutRequest.class);
            String info = AES.decrypt(datos.getToken());
            if (!info.isEmpty()) {
                respuesta = new JSONObject(info);
                return fn.respOk(respuesta);

            } else {
                return fn.respError(null, "Error al obtener información. ", respuesta);
            }
        } catch (Exception e) {
            return fn.respError(e, "Error al obtener información. ", respuesta);
        }
    }
}
