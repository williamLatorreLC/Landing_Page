/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.api;

import co.com.claro.myit.util.MySqlUtils;
import co.com.claro.myit.util.OracleUtils;
import co.com.claro.myit.util.functions;
import java.util.List;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
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
@Path("/people")
@Produces(MediaType.APPLICATION_JSON)
public class People {
    OracleUtils dbUtils;
    
    @Context
    private ServletContext context;
    
    
    private functions fn;
    
    
    @GET
    @Path("/{estado}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String web_get(@PathParam("estado") String estado) {
         fn=new functions(context.getRealPath("/WEB-INF/config.properties"));
        dbUtils = new OracleUtils(context.getRealPath("/WEB-INF/db-oracle.properties"));
        try {
            List res = dbUtils.read("CTMPeopleEntity");
            JSONObject respuesta = new JSONObject();
            respuesta.put("isError", false);
            respuesta.put("response", res);
            return respuesta.toString();
        } catch (JSONException e) {
            e.printStackTrace();
            return fn.respError(e, "Error al obtener datos.", estado);
        }
    }

}
