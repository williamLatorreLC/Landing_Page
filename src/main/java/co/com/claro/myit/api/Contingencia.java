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
import java.util.List;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
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
