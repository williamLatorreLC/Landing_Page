/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import co.com.claro.myit.service.ConsultaNotasOrdenTrabajoService;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;
import javax.servlet.ServletContext;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author dussan.palma
 */
@Path("/ConsultarNotasWO")
public class ConsultaNotasWO {
    
    @Context
    private ServletContext context;
    
    private functions fn;
    
    @POST
    @Produces("application/json")
    public String consultarNotasWO(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        
        ConsultaNotasOrdenTrabajoRequest datos = fn.getData(data, ConsultaNotasOrdenTrabajoRequest.class);
        
        ConsultaNotasOrdenTrabajoService consultaNotasOrdenTrabajoService = new ConsultaNotasOrdenTrabajoService(datos, fn);

        responseString = consultaNotasOrdenTrabajoService.consultarNotasWO();
        
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());         

       JsonObject res = consultaNotasOrdenTrabajoService.getBody(respuesta);
       return fn.respOk(res.getAsJsonObject()); 
    }
    
}
