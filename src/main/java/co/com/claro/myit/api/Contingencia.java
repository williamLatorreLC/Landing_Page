/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.db.BannerEntity;
import co.com.claro.myit.models.BannerModel;
import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.functions;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author JD
 */
@Path("/verificarContingencia")
@Produces(MediaType.APPLICATION_JSON)
public class Contingencia {
    
    MySqlUtils dbUtils;
    
      
    @Context
    private ServletContext context;
    
    
    private functions fn;
    
    
    @GET
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get() {
        fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new MySqlUtils(context.getRealPath("/WEB-INF/db-mysql.properties"));
        try {
            List res = dbUtils.read("ContingenciaEntity");
            boolean estado=false;
            if(!res.isEmpty()){
                JSONObject item=new JSONObject(res.get(0));
                if(item.has("estado")){
                    estado=(item.getInt("estado")==1);
                }
            }
            JSONObject respuesta = new JSONObject();
            JSONObject status = new JSONObject();
            status.put("isActivo", estado);
            respuesta.put("isError", false);
            respuesta.put("response", status);
            return respuesta.toString();
        } catch (JSONException e) {
            return fn.respError(e, "Error al obtener datos.", "");
        }
    }
    
}
