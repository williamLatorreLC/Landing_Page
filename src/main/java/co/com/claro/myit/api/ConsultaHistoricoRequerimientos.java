/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.com.claro.myit.api;

import co.com.claro.myit.service.ConsultaHistoricoRequerimientosService;
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
@Path("/consultarHistoricoRequerimiento")
public class ConsultaHistoricoRequerimientos {
    
    @Context
    private ServletContext context;
    
    private functions fn;
    
    @POST
    @Produces("application/json")
    public String consultarHistoricoRequerimiento(String data) {
        String responseString = "";
        fn = new functions(context.getRealPath("/WEB-INF/config.properties"));
        JsonObject respuesta = new JsonObject();
        
        ConsultaHistoricoRequerimientosRequest datos = fn.getData(data, ConsultaHistoricoRequerimientosRequest.class);
        
        ConsultaHistoricoRequerimientosService consultaHistoricoRequerimientosService = new ConsultaHistoricoRequerimientosService(datos, fn);

        responseString = consultaHistoricoRequerimientosService.ConsultaHistoricoRequerimientos();
        
        JSONObject jsonObj = XML.toJSONObject(responseString);
        respuesta = fn.getResponse(jsonObj.toString());         

       JsonObject res = consultaHistoricoRequerimientosService.getBody(respuesta);
       return fn.respOk(res.getAsJsonObject()); 
    }
    
}
