/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import co.com.claro.myit.service.ConsultaNotasIncidenteService;
import co.com.claro.myit.util.functions;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import org.json.JSONObject;
import org.json.XML;


/**
 *
 * @author dussan.palma
 */
@Path("/ConsultarNotasINC")
public class ConsultaNotasINC {
    
    @Context
    private ServletContext context;
    
    private functions fn;
    
    @POST
    @Produces("application/json")
    public String consultarINC(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        
        ConsultaNotasIncidenteRequest datos = fn.getData(data, ConsultaNotasIncidenteRequest.class);
        
        ConsultaNotasIncidenteService consultaNotasIncidenteService = new ConsultaNotasIncidenteService(datos, fn);

        responseString = consultaNotasIncidenteService.consultarNotasINC();
        
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());         

       JsonObject res = consultaNotasIncidenteService.getBody(respuesta);
       return fn.respOk(res.getAsJsonObject()); 
    }
    
}
